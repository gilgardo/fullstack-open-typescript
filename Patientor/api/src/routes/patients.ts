import express, { NextFunction, Request, Response } from "express";
import patients_service from "../services/patients_service";
import { Entry, NewEntry, NewPatientEntry, Patient } from "../types";
import { NewEntrySchema, NewPatientSchema } from "../schema/intex";
const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(patients_service.getAll());
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const patient = patients_service.getById(id);
  if (!patient) return res.status(404);
  return res.json(patient);
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const newPatientEntry = req.body;
    const addedEntry = patients_service.create(newPatientEntry);
    res.json(addedEntry);
  }
);

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Entry | { error: string }>
  ) => {
    const newEntry = req.body;
    const { id } = req.params;
    const entry = patients_service.createEntry(id, newEntry);
    if (!entry) return res.status(404).json({ error: "patient not found" });
    return res.status(201).json(entry);
  }
);

export default router;
