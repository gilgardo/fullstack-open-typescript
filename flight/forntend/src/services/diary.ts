import axios from "axios";
import { type DiaryEntry, type NewDiaryEntry } from "../types";
const baseUrl = "/api/diaries";

const getAll = async () => {
  const request = axios.get<DiaryEntry[]>(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newObject: NewDiaryEntry) => {
  const response = await axios.post<DiaryEntry>(baseUrl, newObject);
  return response.data;
};

export default { getAll, create };
