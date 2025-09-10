import express, { NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import diagnosesRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";
import z from "zod";

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
};

const app = express();
app.use(express.json());

const PORT = 3001;
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
