import { z } from "zod";
import {
  Entry,
  Gender,
  HealthCheckRating,
  NewPatientEntry,
  PatientWithoutSsn,
} from "../types";

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const HealthCheckRatingSchema = z.enum(HealthCheckRating);

const DischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string(),
});

const SickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: HealthCheckRatingSchema,
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: DischargeSchema,
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional(),
});

export const EntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});

export const NewPatientSchema = PatientSchema.omit({ id: true });
export const PatientSchemaWithoutSsn = PatientSchema.omit({ ssn: true });

export const toNewPatient = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};

export const NewEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema.omit({ id: true }),
  HospitalEntrySchema.omit({ id: true }),
  OccupationalHealthcareEntrySchema.omit({ id: true }),
]);

export const toNewEntry = (object: unknown): Entry => {
  return EntrySchema.parse(object);
};

export const toPatientWithoutSsn = (object: unknown): PatientWithoutSsn => {
  return PatientSchemaWithoutSsn.parse(object);
};
