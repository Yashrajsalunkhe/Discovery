import mongoose, { Document, Schema } from 'mongoose';
import type { Request, Response } from 'express';
import { connectToMongoDB } from './register.js';
import { getNextRegistrationId } from './utils/atomicCounter.js';
import { calculateTeamFee } from './utils/feeCalculation.js';
import { getRazorpayClient, getRazorpayCredentials } from './utils/razorpayConfig.js';

interface SpotRegistrationDoc extends Document {
  spotRegistrationId: number;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: Array<{ name: string; college: string; mobile?: string }>;
  slotKey?: string;
  slotNumber?: number;
  paymentId?: string;
  orderId?: string;
  totalFee?: number;
  createdAt: Date;
}

const teamMemberSchema = new Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  mobile: { type: String, required: false },
}, { _id: false });

const spotRegistrationSchema = new Schema<SpotRegistrationDoc>({
  spotRegistrationId: { type: Number, unique: true, required: true },
  leaderName: { type: String, required: true },
  leaderEmail: { type: String, required: true },
  leaderMobile: { type: String, required: true },
  leaderCollege: { type: String, required: true },
  leaderDepartment: { type: String, required: true },
  leaderYear: { type: String, required: true },
  leaderCity: { type: String, required: true },
  selectedEvent: { type: String, required: true },
  paperPresentationDept: { type: String },
  participationType: { type: String, enum: ['solo', 'team'], required: true },
  teamSize: { type: Number, required: true },
  teamMembers: { type: [teamMemberSchema], default: [] },
  slotKey: { type: String },
  slotNumber: { type: Number },
  paymentId: { type: String },
  orderId: { type: String },
  totalFee: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

spotRegistrationSchema.index({ leaderEmail: 1 });
spotRegistrationSchema.index({ leaderMobile: 1 });

// Capacity and duplicates are enforced by unique indexes, so concurrent requests can't
// both take the last place. Entries saved before slotKey existed are excluded here and
// counted against the limit in code instead.
const slotted = { partialFilterExpression: { slotKey: { $exists: true } }, unique: true };
spotRegistrationSchema.index({ slotKey: 1, slotNumber: 1 }, slotted);
spotRegistrationSchema.index({ slotKey: 1, leaderEmail: 1 }, slotted);
spotRegistrationSchema.index({ slotKey: 1, leaderMobile: 1 }, slotted);
// One entry per payment, so a retried confirmation can't take a second place
spotRegistrationSchema.index({ orderId: 1 }, { partialFilterExpression: { orderId: { $exists: true } }, unique: true });

export const SpotRegistration = mongoose.model<SpotRegistrationDoc>(
  'SpotRegistration',
  spotRegistrationSchema,
  'spot_registrations'
);

// Form data is stored when the order is created, so the entry saved after payment
// matches what was paid for and can't be altered by the browser in between.
interface SpotOrderDoc extends Document {
  orderId: string;
  amount: number;
  registrationData: SpotEntryData;
  status: 'CREATED' | 'REGISTERED' | 'REJECTED';
  paymentId?: string;
  spotRegistrationId?: number;
  createdAt: Date;
}

const spotOrderSchema = new Schema<SpotOrderDoc>({
  orderId: { type: String, unique: true, required: true },
  amount: { type: Number, required: true },
  registrationData: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['CREATED', 'REGISTERED', 'REJECTED'], default: 'CREATED' },
  paymentId: { type: String },
  spotRegistrationId: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const SpotOrder = mongoose.model<SpotOrderDoc>('SpotOrder', spotOrderSchema, 'spot_orders');

let spotIndexesReady: Promise<unknown> | undefined;

const isAdcet = (college: string) => college.trim().toLowerCase() === 'adcet';

const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

// Spot limits are group/entry limits from the event desk, not participant limits.
const SPOT_REGISTRATION_LIMITS: Record<string, number> = {
  'bca|techtreasurehunt': 5,
  'businessadministration|admad': 5,
  'businessadministration|paperpresentation': 2,
  'aidatascience|codemania': 20,
  'aidatascience|promptwars': 10,
  'foodtechnology|newfoodproductdevelopment': 10,
  'foodtechnology|paperpresentation': 4,
  'electricalengineering|troubleshooting': 5,
  'electricalengineering|circuitbuilder': 15,
  'electricalengineering|paperpresentation': 5,
  'iotcybersecurity|catchtheflag': 6,
  'iotcybersecurity|bgmi': 0,
  'iotcybersecurity|paperpresentation': 4,
  'civilengineering|akruti': 20,
  'civilengineering|setu': 5,
  'civilengineering|paperpresentation': 10,
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isPaperPresentation = (event: string) => normalize(event) === 'paperpresentation';

// Limits belong to the event's own department (paper presentation: the chosen
// department), never the participant's department.
const getSpotLimitKey = (event: string, paperPresentationDept?: string) => {
  const eventKey = normalize(event);
  if (isPaperPresentation(event)) {
    return paperPresentationDept ? `${normalize(paperPresentationDept)}|${eventKey}` : undefined;
  }
  return Object.keys(SPOT_REGISTRATION_LIMITS).find((key) => key.endsWith(`|${eventKey}`));
};

const spotEventFilter = (event: string, paperPresentationDept?: string) => ({
  selectedEvent: { $regex: `^${escapeRegex(event.trim())}$`, $options: 'i' },
  ...(isPaperPresentation(event) && paperPresentationDept
    ? { paperPresentationDept: { $regex: `^${escapeRegex(paperPresentationDept.trim())}$`, $options: 'i' } }
    : {}),
});

const getSpotCapacity = async (event: string, paperPresentationDept?: string) => {
  const key = getSpotLimitKey(event, paperPresentationDept);
  if (!key) return undefined;
  const limit = SPOT_REGISTRATION_LIMITS[key];
  const registered = await SpotRegistration.countDocuments(spotEventFilter(event, paperPresentationDept));
  return { limit, registered, remaining: Math.max(limit - registered, 0), isClosed: registered >= limit };
};

// Event names as stored by the frontend, keyed by the normalized event part of the limit keys
const SPOT_EVENT_NAMES: Record<string, string> = {
  techtreasurehunt: 'Tech Treasure Hunt',
  admad: 'Ad-Mad',
  paperpresentation: 'Paper Presentation',
  codemania: 'CodeMania',
  promptwars: 'Prompt Wars',
  newfoodproductdevelopment: 'New Food Product Development',
  troubleshooting: 'Troubleshooting',
  circuitbuilder: 'Circuit Builder',
  catchtheflag: 'Catch the Flag',
  bgmi: 'BGMI',
  akruti: 'AKRUTI',
  setu: 'SETU',
};

const SPOT_DEPARTMENT_NAMES: Record<string, string> = {
  bca: 'BCA',
  businessadministration: 'Business Administration',
  aidatascience: 'AI & Data Science',
  foodtechnology: 'Food Technology',
  electricalengineering: 'Electrical Engineering',
  iotcybersecurity: 'IoT & Cyber Security',
  civilengineering: 'Civil Engineering',
};

export const getSpotStatus = async (_req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    const events = await Promise.all(Object.keys(SPOT_REGISTRATION_LIMITS).map(async (key) => {
      const [departmentKey, eventKey] = key.split('|');
      const event = SPOT_EVENT_NAMES[eventKey];
      const department = SPOT_DEPARTMENT_NAMES[departmentKey];
      const capacity = await getSpotCapacity(event, isPaperPresentation(event) ? department : undefined);
      return { event, department, ...capacity! };
    }));
    return res.json({ success: true, data: events });
  } catch (error) {
    console.error('Spot status error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch spot entry status.' });
  }
};

const SPOT_FEE_PER_MEMBER = 100;
const MAX_SPOT_TEAM_SIZE = 10;
const DUPLICATE_ENTRY_ERROR = 'A spot entry with this email or mobile already exists for this event.';

interface SpotEntryData {
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: Array<{ name: string; college: string; mobile: string }>;
  slotKey: string;
}

class SpotEntryError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const sendSpotError = (res: Response, error: unknown, fallback: string) => {
  if (error instanceof SpotEntryError) {
    return res.status(error.status).json({ success: false, error: error.message });
  }
  console.error(fallback, error);
  return res.status(500).json({ success: false, error: fallback });
};

const parseSpotEntry = (body: any): SpotEntryData => {
  const {
    leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment,
    leaderYear, leaderCity, selectedEvent, paperPresentationDept,
    participationType, teamMembers,
  } = body || {};

  const requiredValues = [leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment,
    leaderYear, leaderCity, selectedEvent, participationType];
  if (requiredValues.some((value) => typeof value !== 'string' || !value.trim())) {
    throw new SpotEntryError(400, 'Please complete all required fields.');
  }
  if (participationType !== 'solo' && participationType !== 'team') {
    throw new SpotEntryError(400, 'Please choose solo or team participation.');
  }

  const normalizedMembers = participationType === 'team'
    ? (Array.isArray(teamMembers) ? teamMembers : []).map((member: any) => ({
      name: String(member?.name || '').trim(),
      college: String(member?.college || '').trim(),
      mobile: String(member?.mobile || '').trim(),
    }))
    : [];

  // The fee is charged per member, so team size comes from the members actually listed
  const teamSize = normalizedMembers.length + 1;
  if (participationType === 'team' && (teamSize < 2 || teamSize > MAX_SPOT_TEAM_SIZE)) {
    throw new SpotEntryError(400, 'Please add your team members.');
  }

  if (isAdcet(leaderCollege) || normalizedMembers.some((member) => isAdcet(member.college))) {
    throw new SpotEntryError(400, 'Spot registration is only available to students from colleges other than ADCET.');
  }

  const normalizedEvent = selectedEvent.trim();
  const normalizedPaperDept = typeof paperPresentationDept === 'string' ? paperPresentationDept.trim() : '';
  if (isPaperPresentation(normalizedEvent) && !normalizedPaperDept) {
    throw new SpotEntryError(400, 'Please select a department for paper presentation.');
  }

  const slotKey = getSpotLimitKey(normalizedEvent, normalizedPaperDept);
  if (!slotKey || !SPOT_REGISTRATION_LIMITS[slotKey]) {
    throw new SpotEntryError(400, 'Spot entry is not available for this event.');
  }

  return {
    leaderName: leaderName.trim(),
    leaderEmail: leaderEmail.trim().toLowerCase(),
    leaderMobile: leaderMobile.trim(),
    leaderCollege: leaderCollege.trim(),
    leaderDepartment: leaderDepartment.trim(),
    leaderYear: leaderYear.trim(),
    leaderCity: leaderCity.trim(),
    selectedEvent: normalizedEvent,
    paperPresentationDept: normalizedPaperDept,
    participationType,
    teamSize,
    teamMembers: normalizedMembers,
    slotKey,
  };
};

// Free place numbers for the entry's event; rejects duplicates and full events
const getFreePlaces = async (data: SpotEntryData) => {
  const limit = SPOT_REGISTRATION_LIMITS[data.slotKey];
  const entries = await SpotRegistration.find(spotEventFilter(data.selectedEvent, data.paperPresentationDept))
    .select('slotNumber leaderEmail leaderMobile').lean();

  if (entries.some((entry) => entry.leaderEmail === data.leaderEmail || entry.leaderMobile === data.leaderMobile)) {
    throw new SpotEntryError(409, DUPLICATE_ENTRY_ERROR);
  }

  const legacyEntries = entries.filter((entry) => entry.slotNumber === undefined).length;
  const taken = new Set(entries.map((entry) => entry.slotNumber));
  const free = Array.from({ length: limit - legacyEntries }, (_, i) => i + 1).filter((n) => !taken.has(n));
  if (free.length === 0) {
    throw new SpotEntryError(409, `Spot registration is full for ${data.selectedEvent}. The limit is ${limit} entries.`);
  }
  return free;
};

const claimSpotPlace = async (data: SpotEntryData, payment: { paymentId: string; orderId: string; totalFee: number }) => {
  // The unique indexes are the capacity guard; make sure they exist before inserting
  // (Model.init() can't be used: its promise is cached from model load, before the DB connects)
  spotIndexesReady ??= SpotRegistration.createIndexes().catch((error) => {
    spotIndexesReady = undefined;
    throw error;
  });
  await spotIndexesReady;

  const limit = SPOT_REGISTRATION_LIMITS[data.slotKey];
  let spotRegistrationId: number | undefined;

  // Claim a free place number; if another request takes it first, re-read and try again
  for (let attempt = 0; attempt <= limit; attempt++) {
    // A concurrent confirmation of the same payment may have just saved the entry
    const existing = await SpotRegistration.findOne({ orderId: payment.orderId });
    if (existing) return existing;

    const free = await getFreePlaces(data);

    // Taken once, so retries don't burn IDs
    spotRegistrationId ??= await getNextRegistrationId('spotRegistrationId');
    try {
      return await SpotRegistration.create({
        ...data,
        ...payment,
        spotRegistrationId,
        // Random pick spreads concurrent requests across the free places
        slotNumber: free[Math.floor(Math.random() * free.length)],
      });
    } catch (error: any) {
      if (error.code !== 11000) throw error;
      if (error.keyPattern?.orderId) continue;
      if (error.keyPattern?.leaderEmail || error.keyPattern?.leaderMobile) {
        throw new SpotEntryError(409, DUPLICATE_ENTRY_ERROR);
      }
      // Place number (or, very rarely, the spot ID) was taken concurrently; retry
      if (error.keyPattern?.spotRegistrationId) spotRegistrationId = undefined;
    }
  }

  throw new SpotEntryError(503, 'Spot desk is busy. Please try again.');
};

// Step 1: validate the entry and create the Razorpay order the browser pays
export const createSpotOrder = async (req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    const data = parseSpotEntry(req.body);
    // Reject duplicates and full events before the participant is charged
    await getFreePlaces(data);

    const { keyId, keySecret } = getRazorpayCredentials();
    if (!keyId || !keySecret) {
      console.error('Razorpay credentials missing');
      return res.status(500).json({ success: false, error: 'Payment service configuration error' });
    }

    const feeBreakdown = calculateTeamFee(data.participationType, data.teamSize, SPOT_FEE_PER_MEMBER);
    const order = await getRazorpayClient().orders.create({
      amount: feeBreakdown.totalAmountInPaise,
      currency: 'INR',
      receipt: `spot_${Date.now()}`,
      payment_capture: true,
      notes: { type: 'spot', event: data.selectedEvent, email: data.leaderEmail },
    });

    await SpotOrder.create({ orderId: order.id, amount: Number(order.amount), registrationData: data });
    console.log('SPOT_ORDER_CREATED', { orderId: order.id, amount: order.amount });
    return res.json({ success: true, order, keyId, feeBreakdown });
  } catch (error: any) {
    if (error?.error?.description) console.error('Spot order Razorpay error:', error.error);
    return sendSpotError(res, error, 'Failed to create spot payment order.');
  }
};

// Step 2: after checkout, save the entry once Razorpay confirms the payment.
// The payment signature is checked by the verifyPayment middleware before this runs.
export const registerSpotUser = async (req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    const orderId = String(req.body.orderId || req.body.razorpay_order_id);
    const paymentId = String(req.body.paymentId || req.body.razorpay_payment_id);

    const spotOrder = await SpotOrder.findOne({ orderId });
    if (!spotOrder) {
      return res.status(400).json({ success: false, error: 'Spot payment order not found. Please register again.' });
    }

    const confirmed = await SpotRegistration.findOne({ orderId });
    if (confirmed) {
      return res.status(201).json({
        success: true,
        message: 'Spot registration completed successfully.',
        spotRegistrationId: confirmed.spotRegistrationId,
      });
    }

    const payment = await getRazorpayClient().payments.fetch(paymentId);
    if (payment.order_id !== orderId || Number(payment.amount) !== spotOrder.amount || payment.currency !== 'INR') {
      console.error('SPOT_PAYMENT_MISMATCH', { orderId, paymentId });
      return res.status(400).json({ success: false, error: 'Payment does not match this spot entry.' });
    }

    // Auto-capture can lag a few seconds behind checkout; the browser retries on 202
    if (payment.status !== 'captured') {
      return res.status(202).json({
        success: false,
        code: 'PAYMENT_PENDING',
        error: `Your payment is still being confirmed. Please click 'Retry Registration' in a moment. Payment ID: ${paymentId}`,
      });
    }

    try {
      const registration = await claimSpotPlace(spotOrder.registrationData, {
        paymentId,
        orderId,
        totalFee: spotOrder.amount / 100,
      });
      await SpotOrder.updateOne(
        { orderId },
        { $set: { status: 'REGISTERED', paymentId, spotRegistrationId: registration.spotRegistrationId } }
      );
      console.log('SPOT_REGISTRATION_CONFIRMED', { orderId, paymentId, spotRegistrationId: registration.spotRegistrationId });
      return res.status(201).json({
        success: true,
        message: 'Spot registration completed successfully.',
        spotRegistrationId: registration.spotRegistrationId,
      });
    } catch (error) {
      if (!(error instanceof SpotEntryError) || error.status !== 409) throw error;
      // Event filled up (or a duplicate got in) between order and payment: needs a refund
      await SpotOrder.updateOne({ orderId, status: 'CREATED' }, { $set: { status: 'REJECTED', paymentId } });
      console.error('SPOT_PAID_BUT_REJECTED', { orderId, paymentId, reason: error.message });
      return res.status(409).json({
        success: false,
        error: `${error.message} Your payment will be refunded; please contact the spot desk with Payment ID: ${paymentId}`,
      });
    }
  } catch (error) {
    return sendSpotError(res, error, 'Failed to save spot registration.');
  }
};
