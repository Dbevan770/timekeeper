import {
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DataFilterModal = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        right: "2.5%",
        top: "3.5rem",
        zIndex: "10",
        maxWidth: "95%",
      }}
    >
      <Paper elevation={5}>
        <Tabs value={0} sx={{ minHeight: "32px" }}>
          <Tab label="CW" sx={{ p: "0", minHeight: "32px" }} />
          <Tab label="7D" sx={{ p: "0", minHeight: "32px" }} />
          <Tab label="M" sx={{ p: "0", minHeight: "32px" }} />
          <Tab label="6M" sx={{ p: "0", minHeight: "32px" }} />
        </Tabs>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ margin: "1rem 1rem 0.5rem 1rem" }}
          spacing={2}
        >
          <Divider sx={{ borderWidth: "2px", flex: "1 1 auto" }} />
          <Typography variant="body1">OR</Typography>
          <Divider sx={{ borderWidth: "2px", flex: "1 1 auto" }} />
        </Stack>
        <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
          Custom Date Range
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          alignItems="center"
          sx={{ margin: "0 1rem", paddingBottom: "2rem" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start Date" />
          </LocalizationProvider>
          <Typography variant="body1"> to </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="End Date" />
          </LocalizationProvider>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DataFilterModal;
