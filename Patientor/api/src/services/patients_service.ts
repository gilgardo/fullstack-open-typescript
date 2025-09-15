import patients from "../../data/patients";
import { toNewEntry, toPatientWithoutSsn } from "../schema/intex";
import {
  Entry,
  NewEntry,
  NewPatientEntry,
  Patient,
  PatientWithoutSsn,
} from "../types";
import { v4 as uuidv4 } from "uuid";

const getAll = (): PatientWithoutSsn[] =>
  patients.map((patient) => toPatientWithoutSsn({ ...patient, entries: [] }));

const create = (patient: NewPatientEntry): Patient => ({
  ...patient,
  entries: [],
  id: uuidv4(),
});

const createEntry = (patientId: string, entry: NewEntry): Entry | null => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return null;

  const newEntry = toNewEntry({
    ...entry,
    id: uuidv4(),
  });

  patient.entries.push(newEntry);
  return newEntry;
};

const getById = (id: string) => patients.find((patient) => patient.id === id);

export default { getAll, create, getById, createEntry };
