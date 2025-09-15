import { useReducer, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import { NewEntry } from "../../types";
import { NewEntryFormState } from "./AddEntryModal";

const today = new Date();
const date = today.toISOString().split("T")[0];

const initialEntry: NewEntryFormState = {
  description: "",
  date,
  specialist: "",
  type: "HealthCheck",
  diagnosisCodes: [],
  healthCheckRating: 2,
};

type ChangePayload<K extends keyof NewEntryFormState> = {
  key: K;
  data: NewEntryFormState[K];
};

type Action =
  | { type: "change"; payload: ChangePayload<keyof NewEntryFormState> }
  | { type: "reset" }
  | { type: "AddCode"; payload: string };

const reducer = (
  state: NewEntryFormState,
  action: Action
): NewEntryFormState => {
  switch (action.type) {
    case "change": {
      const { key, data } = action.payload;
      return { ...state, [key]: data };
    }
    case "AddCode": {
      if (state.diagnosisCodes.some((code) => code === action.payload))
        return state;
      return {
        ...state,
        diagnosisCodes: [...state.diagnosisCodes, action.payload],
      };
    }
    case "reset":
      return initialEntry;
    default:
      return state;
  }
};

const toNewEntry = (form: NewEntryFormState): NewEntry => {
  switch (form.type) {
    case "HealthCheck":
      return {
        type: "HealthCheck",
        description: form.description,
        date: form.date,
        specialist: form.specialist,
        diagnosisCodes: form.diagnosisCodes,
        healthCheckRating: form.healthCheckRating ?? 0,
      };
    case "Hospital":
      return {
        type: "Hospital",
        description: form.description,
        date: form.date,
        specialist: form.specialist,
        diagnosisCodes: form.diagnosisCodes,
        discharge: form.discharge ?? { date: "", criteria: "" },
      };
    case "OccupationalHealthcare":
      return {
        type: "OccupationalHealthcare",
        description: form.description,
        date: form.date,
        specialist: form.specialist,
        diagnosisCodes: form.diagnosisCodes,
        employerName: form.employerName ?? "",
        sickLeave: form.sickLeave,
      };
  }
};

const AddEntryForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (entry: NewEntry) => void;
  onCancel: () => void;
}) => {
  const [entry, dispatch] = useReducer(reducer, initialEntry);
  const [diagnosisCode, setDiagnosisCode] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newEntry = toNewEntry(entry);
    onSubmit(newEntry);
    setDiagnosisCode("");
    dispatch({ type: "reset" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "healthCheckRating") {
      dispatch({
        type: "change",
        payload: { key: "healthCheckRating", data: Number(value) },
      });
    } else {
      dispatch({
        type: "change",
        payload: { key: name as keyof NewEntryFormState, data: value },
      });
    }
  };

  const handleAddDiagnosisCode = () => {
    if (!diagnosisCode.trim()) return;
    dispatch({ type: "AddCode", payload: diagnosisCode });
    setDiagnosisCode("");
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Add New Entry
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={entry.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            name="description"
            value={entry.description}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Specialist"
            name="specialist"
            value={entry.specialist}
            onChange={handleChange}
            fullWidth
          />

          <Stack direction="row" spacing={1}>
            <TextField
              label="Diagnosis Code"
              name="diagnosisCode"
              value={diagnosisCode}
              onChange={(e) => setDiagnosisCode(e.target.value)}
            />
            <Button
              variant="outlined"
              type="button"
              onClick={handleAddDiagnosisCode}>
              Add
            </Button>
          </Stack>

          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <Box>
              <Typography variant="subtitle2">Current Codes:</Typography>
              {entry.diagnosisCodes.map((code) => (
                <Typography key={"newEntry " + code} variant="body2">
                  {code}
                </Typography>
              ))}
            </Box>
          )}

          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              row
              name="type"
              value={entry.type}
              onChange={handleChange}>
              <FormControlLabel
                value="Hospital"
                control={<Radio />}
                label="Hospital"
              />
              <FormControlLabel
                value="OccupationalHealthcare"
                control={<Radio />}
                label="Occupational"
              />
              <FormControlLabel
                value="HealthCheck"
                control={<Radio />}
                label="Health Check"
              />
            </RadioGroup>
          </FormControl>

          <SpecificFields
            entry={entry}
            dispatch={dispatch}
            handleChange={handleChange}
          />
          <Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: "right",
                }}
                type="submit"
                variant="contained">
                Add
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Paper>
  );
};

const SpecificFields = ({
  entry,
  dispatch,
  handleChange,
}: {
  entry: NewEntryFormState;
  dispatch: React.Dispatch<Action>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Health Check</FormLabel>
          <RadioGroup
            row
            name="healthCheckRating"
            value={entry.healthCheckRating}
            onChange={handleChange}>
            <FormControlLabel value="0" control={<Radio />} label="Healthy" />
            <FormControlLabel value="1" control={<Radio />} label="Low Risk" />
            <FormControlLabel value="2" control={<Radio />} label="High Risk" />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="Critical Risk"
            />
          </RadioGroup>
        </FormControl>
      );

    case "Hospital": {
      const discharge = entry.discharge ?? { date, criteria: "" };
      const handleDischarge = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({
          type: "change",
          payload: {
            key: "discharge",
            data: { ...discharge, [name]: value },
          },
        });
      };
      return (
        <Stack spacing={2}>
          <TextField
            label="Discharge Date"
            type="date"
            name="date"
            value={discharge.date}
            onChange={handleDischarge}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Discharge Criteria"
            name="criteria"
            value={discharge.criteria}
            onChange={handleDischarge}
            fullWidth
          />
        </Stack>
      );
    }

    case "OccupationalHealthcare": {
      const sickLeave = entry.sickLeave ?? { startDate: date, endDate: date };
      const handleSickLeave = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({
          type: "change",
          payload: {
            key: "sickLeave",
            data: { ...sickLeave, [name]: value },
          },
        });
      };

      return (
        <Stack spacing={2}>
          <TextField
            name="employerName"
            label="Employer Name"
            value={entry.employerName ?? ""}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Sick Leave Start"
            type="date"
            name="startDate"
            value={sickLeave.startDate}
            onChange={handleSickLeave}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Sick Leave End"
            type="date"
            name="endDate"
            value={sickLeave.endDate}
            onChange={handleSickLeave}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      );
    }

    default:
      return null;
  }
};

export default AddEntryForm;
