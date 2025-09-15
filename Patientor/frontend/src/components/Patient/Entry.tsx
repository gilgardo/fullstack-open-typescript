import {
  Card,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Diagnose, type Entry, HealthCheckRating } from "../../types";

const HealthRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  const colors: Record<
    HealthCheckRating,
    "success" | "info" | "warning" | "error"
  > = {
    [HealthCheckRating.Healthy]: "success",
    [HealthCheckRating.LowRisk]: "info",
    [HealthCheckRating.HighRisk]: "warning",
    [HealthCheckRating.CriticalRisk]: "error",
  };

  return <FavoriteIcon color={colors[rating]} />;
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <>
          <Typography variant="body2">
            <strong>Discharge:</strong> {entry.discharge.date} -{" "}
            {entry.discharge.criteria}
          </Typography>
          <LocalHospitalIcon color="error" />
        </>
      );
    case "OccupationalHealthcare":
      return (
        <>
          <Typography variant="body2">
            <strong>Employer:</strong> {entry.employerName}
          </Typography>
          {entry.sickLeave && (
            <Typography variant="body2">
              Sick leave: {entry.sickLeave.startDate} →{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
          <WorkIcon color="primary" />
        </>
      );
    case "HealthCheck":
      return (
        <>
          <Typography variant="body2">
            <strong>Health check rating:</strong> {entry.healthCheckRating}
          </Typography>
          <HealthRatingIcon rating={entry.healthCheckRating} />
        </>
      );
    default:
      return null;
  }
};

const EntryCard = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnose[];
}) => {
  const patientDiagnoses = entry.diagnosisCodes
    ?.map((code) => diagnoses.find((diagnose) => diagnose.code === code))
    .filter((diagnose) => !!diagnose);

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {entry.date}{" "}
          </Typography>
          <Typography variant="caption" fontStyle="italic">
            {entry.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Specialist: {entry.specialist}
          </Typography>
          {patientDiagnoses && patientDiagnoses.length > 0 && (
            <List dense disablePadding>
              {patientDiagnoses.map((diagnose) => (
                <ListItem key={diagnose.code} disablePadding>
                  <ListItemText
                    primary={`${diagnose.code} - ${diagnose.name}`}
                    secondary={diagnose.latin}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <EntryDetails entry={entry} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EntryCard;
