import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Diagnose, NewEntry, Patient } from "../../types";
import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import { Typography, Card, CardContent, Stack, Button } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import EntryCard from "./Entry";
import AddPatientModal from "./AddEntryModal";
import axios from "axios";

const Patient = () => {
  const id = useParams().id ?? "";
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnose[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      const data = await patientService.getById(id);
      setPatient(data);
    };
    const fetchDiagnoses = async () => {
      const data = await diagnoseService.getAll();
      setDiagnoses(data);
    };
    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  const createEntry = async (entry: NewEntry) => {
    try {
      const newEntry = await patientService.createEntry(id, entry);
      console.log(newEntry, entry);
      setPatient((prev) => {
        if (!prev) return prev;
        return { ...prev, entries: prev.entries.concat(newEntry) };
      });
      closeModal();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if (!patient || !diagnoses) return null;

  return (
    <Card sx={{ maxWidth: 500, mt: 2, boxShadow: 3 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" align="left">
            {patient.name}{" "}
            {patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <strong>SSN:</strong> {patient.ssn}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <strong>Occupation:</strong> {patient.occupation}
          </Typography>
        </Stack>
        <hr />
        <Typography variant="subtitle1" align="left" fontWeight="bold">
          Entries:
        </Typography>
        <Stack spacing={1}>
          {patient.entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} diagnoses={diagnoses} />
          ))}
          <AddPatientModal
            modalOpen={modalOpen}
            onSubmit={createEntry}
            error={error}
            onClose={closeModal}
          />
          <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Patient;
