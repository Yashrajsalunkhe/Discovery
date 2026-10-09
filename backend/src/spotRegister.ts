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
  createdAt: { type: Date, default: Date.now },
});

spotRegistrationSchema.index({ leaderEmail: 1 });
spotRegistrationSchema.index({ leaderMobile: 1 });

export const SpotRegistration = mongoose.model<SpotRegistrationDoc>(
  'SpotRegistration',
  spotRegistrationSchema,
  'spot_registrations'
);

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

const getSpotLimit = (department: string, event: string) =>
  SPOT_REGISTRATION_LIMITS[`${normalize(department)}|${normalize(event)}`];

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
    const eventDepartment = normalizedEvent.toLowerCase() === 'paper presentation'
      ? String(paperPresentationDept || leaderDepartment).trim()
      : leaderDepartment.trim();
    const spotLimit = getSpotLimit(eventDepartment, normalizedEvent);
    if (spotLimit === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Spot entry is not available for this department and event.',
      });
    }

    const existingSpotEntries = await SpotRegistration.countDocuments({
      selectedEvent: { $regex: `^${normalizedEvent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      [normalizedEvent.toLowerCase() === 'paper presentation' ? 'paperPresentationDept' : 'leaderDepartment']:
        { $regex: `^${eventDepartment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });
    if (existingSpotEntries >= spotLimit) {
      return res.status(409).json({
        success: false,
        error: `Spot registration is full for ${normalizedEvent}. The limit is ${spotLimit} entries.`,
      });
    }

    const spotRegistrationId = await getNextRegistrationId('spotRegistrationId');
    const registration = await SpotRegistration.create({
      spotRegistrationId,
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim().toLowerCase(),
      leaderMobile: leaderMobile.trim(),
      leaderCollege: leaderCollege.trim(),
      leaderDepartment: leaderDepartment.trim(),
      leaderYear: leaderYear.trim(),
      leaderCity: leaderCity.trim(),
      selectedEvent: normalizedEvent,
      paperPresentationDept: paperPresentationDept?.trim() || '',
      participationType,
      teamSize: Number(teamSize) || 1,
      teamMembers: normalizedMembers,
    });

    return res.status(201).json({
      success: true,
      message: 'Spot registration completed successfully.',
      spotRegistrationId: registration.spotRegistrationId,
    });
  } catch (error) {
    console.error('Spot registration error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save spot registration.' });
  }
};
