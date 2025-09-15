import express from "express";
import diagnoses_service from "../services/diagnoses_service";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(diagnoses_service.getAll());
});

export default router;
