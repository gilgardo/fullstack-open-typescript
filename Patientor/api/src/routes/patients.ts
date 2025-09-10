import express, { NextFunction, Request, Response } from "express";
import patients_service from "../services/patients_service";
import { NewPatientEntry, Patient } from "../types";
import { NewPatientSchema } from "../schema/intex";
const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(patients_service.getAll());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
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

export default router;
