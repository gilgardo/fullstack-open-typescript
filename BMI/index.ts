import express from "express";
import bmi from "./calculateBmi";
import { isStringNumberArr, makeNumberArr } from "./utils";
import evaluateData from "./exerciseCalculator";
const app = express();

app.get("/info", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight)
    return res.status(404).json({ error: "Some parameters are missing" });
  if (!isStringNumberArr([height as string, weight as string]))
    return res
      .status(404)
      .json({ error: "All the parameters need to be numbers" });
  return res.send(bmi(Number(height), Number(weight)));
});

app.post("/exercise", (req, res) => {
  const { data, target } = req.body;
  const daily_exercises = data as string[];
  if (!daily_exercises || !daily_exercises[0] || !target)
    return res.status(404).json({ error: "Some parameters are missing" });
  if (!isStringNumberArr([...daily_exercises, target]))
    return res.status(404).json({ error: "malformatted parameters" });
  return res.json(evaluateData(makeNumberArr(daily_exercises), Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
