import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert,
} from "@mui/material";

import AddEntryForm from "./AddEntryForm";
import { NewEntry } from "../../types";

export type NewEntryFormState = {
  description: string;
  date: string;
  specialist: string;
  type: "HealthCheck" | "Hospital" | "OccupationalHealthcare";
  diagnosisCodes: string[];
  healthCheckRating?: number;
  discharge?: { date: string; criteria: string };
  employerName?: string;
  sickLeave?: { startDate: string; endDate: string };
};

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddPatientModal;
