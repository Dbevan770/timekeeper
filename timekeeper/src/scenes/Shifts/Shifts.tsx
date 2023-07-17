import { Box, Stack, Snackbar, Alert, Button, IconButton } from "@mui/material";
import { AccessTime, Close } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import ShiftItem from "../../components/ShiftItem/ShiftItem";
import Loading from "../../components/Loading/Loading";
import { useWages } from "../../context/WagesContext";
import { useState } from "react";

const Shifts = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [isUndoAction, setIsUndoAction] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { wages, isLoadingWages, undoDelete, deleteWage } = useWages();

  const handleDelete = async (docId: string) => {
    if (docId !== "") {
      setCollapsedItems((prev) => ({ ...prev, [docId]: true }));
      const response = await deleteWage(docId);
      if (response) {
        setSeverity("success");
        setMessage("Shift successfully deleted!");
        setIsUndoAction(true);
        setSnackbarOpen(true);
      } else {
        setCollapsedItems((prev) => ({ ...prev, [docId]: false }));
        setSeverity("error");
        setMessage("Shift deletion failed.");
        setIsUndoAction(false);
        setSnackbarOpen(true);
      }
    }
  };

  const handleUndo = async () => {
    setSnackbarOpen(false);
    const response = await undoDelete();
    if (response) {
      setSnackbarOpen(true);
      setSeverity("success");
      setMessage("Undo Successful!");
      setIsUndoAction(false);
    } else {
      setSnackbarOpen(true);
      setSeverity("error");
      setMessage("Failed to undo deletion");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: "100%", height: "100dvh" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <NavHeader label="Shifts" setLoading={setLoading} icon={AccessTime} />
        <Box
          sx={{
            flex: "1 0 auto",
            maxHeight: "95dvh",
            overflowY: "auto",
            overflowX: "hidden",
            marginTop: "1.5rem",
            paddingRight: "0.75rem",
            paddingLeft: "0.5rem",
          }}
        >
          {loading ? (
            <Loading label="Loading data..." />
          ) : !isLoadingWages ? (
            wages.length > 0 ? (
              <>
                <Stack spacing={1.5} sx={{ paddingBottom: "0.5rem" }}>
                  {wages.map((wage) => {
                    return (
                      <ShiftItem
                        key={wage.docId}
                        wage={wage}
                        handleDelete={handleDelete}
                        isCollapsed={collapsedItems[wage.docId] || false}
                        setSnackbarOpen={setSnackbarOpen}
                        setMessage={setMessage}
                        setSeverity={setSeverity}
                      />
                    );
                  })}
                </Stack>
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <Alert
                    severity={severity}
                    sx={{ width: "100%" }}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    action={[
                      isUndoAction && (
                        <Button
                          color="inherit"
                          size="small"
                          onClick={handleUndo}
                        >
                          UNDO
                        </Button>
                      ),
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleSnackbarClose}
                      >
                        <Close fontSize="inherit" />
                      </IconButton>,
                    ]}
                  >
                    {message}
                  </Alert>
                </Snackbar>
              </>
            ) : (
              <div>No wages</div>
            )
          ) : (
            <Loading label="Loading data..." />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Shifts;
