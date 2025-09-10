import { z } from "zod";
import { Gender, NewPatientEntry, PatientWithoutSsn } from "../types";

export const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

export const NewPatientSchema = PatientSchema.omit({ id: true });
export const PatientSchemaWithoutSsn = PatientSchema.omit({ ssn: true });

export const toNewPatient = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};

export const toPatientWithoutSsn = (object: unknown): PatientWithoutSsn => {
  return PatientSchemaWithoutSsn.parse(object);
};
