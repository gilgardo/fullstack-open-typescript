import { useContext, useReducer } from "react";
import type { DiaryEntry, NewDiaryEntry } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import diaryService from "../services/diary";
import MessageContext from "../MessageContext";
import axios from "axios";

const today = new Date();
const date = today.toISOString().split("T")[0];

type ChangePayload<K extends keyof NewDiaryEntry> = {
  key: K;
  data: NewDiaryEntry[K];
};

type Action =
  | { type: "change"; payload: ChangePayload<keyof NewDiaryEntry> }
  | { type: "reset" };

const initialEntry: NewDiaryEntry = {
  date,
  visibility: "ok",
  weather: "sunny",
  comment: "",
};

const reducer = (state: NewDiaryEntry, action: Action) => {
  switch (action.type) {
    case "change": {
      const { payload } = action;
      return { ...state, [payload.key]: payload.data };
    }
    case "reset":
      return initialEntry;
    default:
      return state;
  }
};

const Form = () => {
  const [entry, dispatch] = useReducer(reducer, initialEntry);
  const queryClient = useQueryClient();
  const { message, setMessage } = useContext(MessageContext);

  const { mutate } = useMutation({
    mutationFn: (entry: NewDiaryEntry) => diaryService.create(entry),
    onSuccess: (entry) => {
      const entries: DiaryEntry[] = queryClient.getQueryData(["entries"]) ?? [];
      queryClient.setQueryData(["entries"], [...entries, entry]);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data, 5);
      } else {
        console.log(error);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "change",
      payload: {
        key: e.target.name as keyof NewDiaryEntry,
        data: e.target.value,
      },
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    mutate(entry);
    dispatch({ type: "reset" });
  };

  return (
    <>
      <h2>Add a new entry</h2>
      {message !== "" && (
        <p role="alert" style={{ color: "red" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">date</label>
        <input
          type="date"
          name="date"
          value={entry.date}
          onChange={handleChange}
        />
        <div>
          Visibility:
          {["great", "good", "ok", "poor"].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={v === entry.visibility}
                onChange={handleChange}
              />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
        <div>
          Weather
          {["sunny", "rainy", "cloudy", "stormy", "windy"].map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={entry.weather === w}
                onChange={handleChange}
              />
              {w.charAt(0).toUpperCase() + w.slice(1)}
            </label>
          ))}
        </div>
        <label htmlFor="comment">comment</label>
        <input
          type="text"
          name="comment"
          value={entry.comment}
          onChange={handleChange}
        />

        <button>Add</button>
      </form>
    </>
  );
};

export default Form;
