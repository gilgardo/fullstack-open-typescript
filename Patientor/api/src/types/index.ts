interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnose["code"][];
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export type Discharge = {
  date: string;
  criteria: string;
};

export type SickLeave = {
  startDate: string;
  endDate: string;
};

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  sickLeave?: SickLeave;
  employerName: string;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export type Diagnose = {
  code: string;
  name: string;
  latin?: string;
};

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
};

export type PatientWithoutSsn = Omit<Patient, "ssn" | "entries">;
export type NewPatientEntry = Omit<Patient, "id" | "entries">;
export type NewEntry = Omit<Entry, "id">;
