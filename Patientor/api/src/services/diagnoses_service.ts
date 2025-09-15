import diagnoses from "../../data/diagnoses";
import { Diagnose } from "../types";

const getAll = (): Diagnose[] => diagnoses;

export default { getAll };
