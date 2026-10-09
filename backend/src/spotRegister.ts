import mongoose, { Document, Schema } from 'mongoose';
import type { Request, Response } from 'express';
import { connectToMongoDB } from './register.js';
import { getNextRegistrationId } from './utils/atomicCounter.js';

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

export const SpotRegistration = mongoose.model<SpotRegistrationDoc>(
  'SpotRegistration',
  spotRegistrationSchema,
  'spot_registrations'
);

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

export const registerSpotUser = async (req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    const {
      leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment,
      leaderYear, leaderCity, selectedEvent, paperPresentationDept,
      participationType, teamSize, teamMembers,
    } = req.body;

    const requiredValues = [leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment,
      leaderYear, leaderCity, selectedEvent, participationType];
    if (requiredValues.some((value) => typeof value !== 'string' || !value.trim())) {
      return res.status(400).json({ success: false, error: 'Please complete all required fields.' });
    }

    const normalizedMembers = (Array.isArray(teamMembers) ? teamMembers : []).map((member: any) => ({
      name: String(member.name || '').trim(),
      college: String(member.college || '').trim(),
      mobile: String(member.mobile || '').trim(),
    }));

    if (isAdcet(leaderCollege) || normalizedMembers.some((member) => isAdcet(member.college))) {
      return res.status(400).json({
        success: false,
        error: 'Spot registration is only available to students from colleges other than ADCET.',
      });
    }

    const normalizedEvent = selectedEvent.trim();
    const normalizedPaperDept = typeof paperPresentationDept === 'string' ? paperPresentationDept.trim() : '';
    if (isPaperPresentation(normalizedEvent) && !normalizedPaperDept) {
      return res.status(400).json({ success: false, error: 'Please select a department for paper presentation.' });
    }

    const slotKey = getSpotLimitKey(normalizedEvent, normalizedPaperDept);
    if (!slotKey || !SPOT_REGISTRATION_LIMITS[slotKey]) {
      return res.status(400).json({
        success: false,
        error: 'Spot entry is not available for this event.',
      });
    }

    // The unique indexes are the capacity guard; make sure they exist before inserting
    // (Model.init() can't be used: its promise is cached from model load, before the DB connects)
    spotIndexesReady ??= SpotRegistration.createIndexes().catch((error) => {
      spotIndexesReady = undefined;
      throw error;
    });
    await spotIndexesReady;

    const leader = { email: leaderEmail.trim().toLowerCase(), mobile: leaderMobile.trim() };
    const limit = SPOT_REGISTRATION_LIMITS[slotKey];
    let spotRegistrationId: number | undefined;
    let registration: SpotRegistrationDoc | undefined;

    // Claim a free place number; if another request takes it first, re-read and try again
    for (let attempt = 0; attempt <= limit && !registration; attempt++) {
      const entries = await SpotRegistration.find(spotEventFilter(normalizedEvent, normalizedPaperDept))
        .select('slotNumber leaderEmail leaderMobile').lean();

      if (entries.some((entry) => entry.leaderEmail === leader.email || entry.leaderMobile === leader.mobile)) {
        return res.status(409).json({
          success: false,
          error: 'A spot entry with this email or mobile already exists for this event.',
        });
      }

      const legacyEntries = entries.filter((entry) => entry.slotNumber === undefined).length;
      const taken = new Set(entries.map((entry) => entry.slotNumber));
      const free = Array.from({ length: limit - legacyEntries }, (_, i) => i + 1).filter((n) => !taken.has(n));
      if (free.length === 0) {
        return res.status(409).json({
          success: false,
          error: `Spot registration is full for ${normalizedEvent}. The limit is ${limit} entries.`,
        });
      }

      // Taken once, so retries don't burn IDs
      spotRegistrationId ??= await getNextRegistrationId('spotRegistrationId');
      try {
        registration = await SpotRegistration.create({
          spotRegistrationId,
          leaderName: leaderName.trim(),
          leaderEmail: leader.email,
          leaderMobile: leader.mobile,
          leaderCollege: leaderCollege.trim(),
          leaderDepartment: leaderDepartment.trim(),
          leaderYear: leaderYear.trim(),
          leaderCity: leaderCity.trim(),
          selectedEvent: normalizedEvent,
          paperPresentationDept: normalizedPaperDept,
          participationType,
          teamSize: Number(teamSize) || 1,
          teamMembers: normalizedMembers,
          slotKey,
          // Random pick spreads concurrent requests across the free places
          slotNumber: free[Math.floor(Math.random() * free.length)],
        });
      } catch (error: any) {
        if (error.code !== 11000) throw error;
        if (error.keyPattern?.leaderEmail || error.keyPattern?.leaderMobile) {
          return res.status(409).json({
            success: false,
            error: 'A spot entry with this email or mobile already exists for this event.',
          });
        }
        // Place number (or, very rarely, the spot ID) was taken concurrently; retry
        if (error.keyPattern?.spotRegistrationId) spotRegistrationId = undefined;
      }
    }

    if (!registration) {
      return res.status(503).json({ success: false, error: 'Spot desk is busy. Please submit again.' });
    }

    return res.status(201).json({
      success: true,
      message: 'Spot registration completed successfully.',
      spotRegistrationId: registration!.spotRegistrationId,
    });
  } catch (error) {
    console.error('Spot registration error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save spot registration.' });
  }
};
