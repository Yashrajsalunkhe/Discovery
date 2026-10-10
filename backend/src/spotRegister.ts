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
  lastReconciledAt?: Date;
  createdAt: Date;
}

const spotOrderSchema = new Schema<SpotOrderDoc>({
  orderId: { type: String, unique: true, required: true },
  amount: { type: Number, required: true },
  registrationData: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['CREATED', 'REGISTERED', 'REJECTED'], default: 'CREATED' },
  paymentId: { type: String },
  spotRegistrationId: { type: Number },
  lastReconciledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

spotOrderSchema.index({ status: 1, lastReconciledAt: 1, createdAt: 1 });

const SpotOrder = mongoose.model<SpotOrderDoc>('SpotOrder', spotOrderSchema, 'spot_orders');

let spotIndexesReady: Promise<unknown> | undefined;

const isAdcet = (college: string) => college.trim().toLowerCase() === 'adcet';

const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

// Spot limits are group/entry limits from the event desk, not participant limits.
const SPOT_REGISTRATION_LIMITS: Record<string, number> = {
  'bca|techtreasurehunt': 5,
  'businessadministration|admad': 5,
  'businessadministration|paperpresentation': 12,
  'aidatascience|codemania': 20,
  'aidatascience|promptwars': 10,
  'foodtechnology|newfoodproductdevelopment': 10,
  'foodtechnology|paperpresentation': 14,
  'electricalengineering|troubleshooting': 5,
  'electricalengineering|circuitbuilder': 15,
  'electricalengineering|paperpresentation': 15,
  'iotcybersecurity|catchtheflag': 6,
  'iotcybersecurity|bgmi': 0,
  'iotcybersecurity|paperpresentation': 14,
  'civilengineering|akruti': 20,
  'civilengineering|setu': 5,
  'civilengineering|paperpresentation': 20,
  'mechanicalengineering|paperpresentation': 30,
  'aeronauticalengineering|paperpresentation': 10,
  'computerscienceengineering|paperpresentation': 10,
  'aidatascience|paperpresentation': 10,
  'bca|paperpresentation': 10,
  'roboticsai|innovatexroboticsai': 40,
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
  innovatexroboticsai: 'InnovateX - Robotics & AI',
};

const SPOT_DEPARTMENT_NAMES: Record<string, string> = {
  bca: 'BCA',
  businessadministration: 'Business Administration',
  aidatascience: 'AI & Data Science',
  foodtechnology: 'Food Technology',
  electricalengineering: 'Electrical Engineering',
  iotcybersecurity: 'IoT & Cyber Security',
  civilengineering: 'Civil Engineering',
  mechanicalengineering: 'Mechanical Engineering',
  aeronauticalengineering: 'Aeronautical Engineering',
  computerscienceengineering: 'Computer Science Engineering',
  roboticsai: 'Robotics & AI',
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

// Created one at a time so an index added outside the app with clashing options (as
// happened in Atlas) is logged instead of failing every spot entry.
const ensureSpotIndexes = async () => {
  for (const [fields, options] of SpotRegistration.schema.indexes()) {
    try {
      await SpotRegistration.collection.createIndex(fields as any, options as any);
    } catch (error: any) {
      // 85/86: an index with this name or these keys already exists with other options
      if (error.code !== 85 && error.code !== 86) throw error;
      console.error('SPOT_INDEX_CONFLICT', { fields, error: error.message });
    }
  }
};

const claimSpotPlace = async (data: SpotEntryData, payment: { paymentId: string; orderId: string; totalFee: number }) => {
  // The unique indexes are the capacity guard; make sure they exist before inserting
  // (Model.init() can't be used: its promise is cached from model load, before the DB connects)
  spotIndexesReady ??= ensureSpotIndexes().catch((error) => {
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

export const isSpotOrder = async (orderId: string) => Boolean(await SpotOrder.exists({ orderId }));

type SpotPaymentResult =
  | { spotRegistrationId: number }
  | { pending: true }
  | { rejected: true; error: string }
  | { invalid: true; error: string };

/**
 * Save the spot entry for a paid order. Shared by the browser confirmation, the Razorpay
 * webhook and the background reconciliation, so an entry is saved even if the browser
 * closes after payment. Safe to call repeatedly: an order only ever gets one entry.
 */
export async function processSpotPayment(orderId: string, paymentId: string): Promise<SpotPaymentResult> {
  await connectToMongoDB();
  const spotOrder = await SpotOrder.findOne({ orderId });
  if (!spotOrder) return { invalid: true, error: 'Spot payment order not found. Please register again.' };

  const confirmed = await SpotRegistration.findOne({ orderId });
  if (confirmed) {
    await SpotOrder.updateOne(
      { orderId, status: { $ne: 'REGISTERED' } },
      { $set: { status: 'REGISTERED', paymentId: confirmed.paymentId || paymentId, spotRegistrationId: confirmed.spotRegistrationId } }
    );
    return { spotRegistrationId: confirmed.spotRegistrationId };
  }

  const payment = await getRazorpayClient().payments.fetch(paymentId);
  if (payment.order_id !== orderId || Number(payment.amount) !== spotOrder.amount || payment.currency !== 'INR') {
    console.error('SPOT_PAYMENT_MISMATCH', { orderId, paymentId });
    return { invalid: true, error: 'Payment does not match this spot entry.' };
  }

  // Auto-capture can lag a few seconds behind checkout
  if (payment.status !== 'captured') return { pending: true };

  const data = spotOrder.registrationData;
  try {
    // Entry already recorded at the desk without an online payment (e.g. while online
    // confirmation was failing): attach this payment to it instead of rejecting it
    const deskEntry = await SpotRegistration.findOneAndUpdate(
      {
        slotKey: data.slotKey,
        paymentId: { $exists: false },
        $or: [{ leaderEmail: data.leaderEmail }, { leaderMobile: data.leaderMobile }],
      },
      { $set: { paymentId, orderId, totalFee: spotOrder.amount / 100 } },
      { new: true }
    );
    const registration = deskEntry ?? await claimSpotPlace(data, {
      paymentId,
      orderId,
      totalFee: spotOrder.amount / 100,
    });
    await SpotOrder.updateOne(
      { orderId },
      { $set: { status: 'REGISTERED', paymentId, spotRegistrationId: registration.spotRegistrationId } }
    );
    console.log('SPOT_REGISTRATION_CONFIRMED', { orderId, paymentId, spotRegistrationId: registration.spotRegistrationId });
    return { spotRegistrationId: registration.spotRegistrationId };
  } catch (error) {
    if (!(error instanceof SpotEntryError) || error.status !== 409) throw error;
    // Event filled up (or a duplicate got in) between order and payment: needs a refund
    await SpotOrder.updateOne({ orderId, status: 'CREATED' }, { $set: { status: 'REJECTED', paymentId } });
    console.error('SPOT_PAID_BUT_REJECTED', { orderId, paymentId, reason: error.message });
    return {
      rejected: true,
      error: `${error.message} Your payment will be refunded; please contact the spot desk with Payment ID: ${paymentId}`,
    };
  }
}

/**
 * Finish spot orders that were paid but never confirmed (browser closed, webhook missed).
 */
export async function reconcilePendingSpotOrders(limit = 10) {
  await connectToMongoDB();
  const now = Date.now();
  // Least-recently-checked first, so abandoned checkouts can't starve newer paid orders
  const pending = await SpotOrder.find({
    status: 'CREATED',
    // Give the browser/webhook path a moment before stepping in
    createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000), $lte: new Date(now - 60 * 1000) },
  }).sort({ lastReconciledAt: 1, createdAt: 1 }).limit(limit).lean();
  if (!pending.length) return { checked: 0, confirmed: 0 };

  const razorpay = getRazorpayClient();
  let confirmed = 0;
  for (const order of pending) {
    try {
      await SpotOrder.updateOne({ _id: order._id }, { $set: { lastReconciledAt: new Date() } });
      const { items } = await razorpay.orders.fetchPayments(order.orderId);
      const captured = items.find((payment) => payment.status === 'captured');
      if (!captured) continue;
      const result = await processSpotPayment(order.orderId, captured.id);
      if ('spotRegistrationId' in result) {
        confirmed++;
        console.log('SPOT_PAYMENT_RECONCILED', { orderId: order.orderId, paymentId: captured.id, spotRegistrationId: result.spotRegistrationId });
      }
    } catch (error: any) {
      console.error('SPOT_RECONCILE_FAILED', { orderId: order.orderId, error: error.message });
    }
  }
  return { checked: pending.length, confirmed };
}

// Step 2 (browser): confirm right after checkout. The webhook and reconciliation save
// the entry too, so this is only the fast path. The payment signature is checked by
// the verifyPayment middleware before this runs.
export const registerSpotUser = async (req: Request, res: Response) => {
  try {
    const orderId = String(req.body.orderId || req.body.razorpay_order_id);
    const paymentId = String(req.body.paymentId || req.body.razorpay_payment_id);
    const result = await processSpotPayment(orderId, paymentId);

    if ('spotRegistrationId' in result) {
      return res.status(201).json({
        success: true,
        message: 'Spot registration completed successfully.',
        spotRegistrationId: result.spotRegistrationId,
      });
    }
    if ('pending' in result) {
      return res.status(202).json({
        success: true,
        code: 'REGISTRATION_PENDING',
        message: 'Payment received. Your spot entry will be confirmed automatically. Please do not pay again.',
      });
    }
    return res.status('rejected' in result ? 409 : 400).json({ success: false, error: result.error });
  } catch (error) {
    return sendSpotError(res, error, 'Failed to save spot registration.');
  }
};
