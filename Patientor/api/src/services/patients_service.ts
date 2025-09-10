import patients from "../../data/patients";
import { toPatientWithoutSsn } from "../schema/intex";
import { NewPatientEntry, Patient, PatientWithoutSsn } from "../types";
import { v4 as uuidv4 } from "uuid";

const getAll = (): PatientWithoutSsn[] =>
  patients.map((patient) => toPatientWithoutSsn(patient));

const create = (patient: NewPatientEntry): Patient => ({
  ...patient,
  id: uuidv4(),
});

export default { getAll, create };
