import { z } from 'zod';
import { Gender, HealthCheckRating, EntryType } from '../types';

// Potilasvalidaattori (nykyinen)
export const newPatientSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Invalid gender" }) }),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),
});

export type NewPatient = z.infer<typeof newPatientSchema>;

// Yhteiset kentät kaikille entryille
const baseEntry = z.object({
  description: z.string().min(1),
  date: z.string().min(1),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional()
});

// HealthCheckEntry
const healthCheckEntry = baseEntry.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

// HospitalEntry
const hospitalEntry = baseEntry.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().min(1),
    criteria: z.string().min(1)
  })
});

// OccupationalHealthcareEntry
const occupationalEntry = baseEntry.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(1),
  sickLeave: z.object({
    startDate: z.string().min(1),
    endDate: z.string().min(1)
  }).optional()
});

// Union kaikista entry-tyypeistä
export const newEntrySchema = z.union([
  healthCheckEntry,
  hospitalEntry,
  occupationalEntry
]);

export type NewEntry = z.infer<typeof newEntrySchema>;
