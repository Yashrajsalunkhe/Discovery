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
      selectedEvent: selectedEvent.trim(),
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
