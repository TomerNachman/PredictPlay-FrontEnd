

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { jwtDecode } from "jwt-decode";

const Participants = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
    }

    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${API_URL}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleGuessGames = (id) => {
    navigate(`/predictions/${id}`);
  };

  const handleDeleteClick = (participant) => {
    setSelectedParticipant(participant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedParticipant(null);
  };

  const handleDeleteParticipant = async () => {
    try {
      await axios.delete(`${API_URL}/participants/${selectedParticipant._id}`);
      setParticipants(participants.filter((p) => p._id !== selectedParticipant._id));
      handleCloseDialog();
      setSnackbarMessage("משתמש נמחק בהצלחה!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting participant:", error);
      setSnackbarMessage("שגיאה במחיקת המשתמש. נסה שוב.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", marginBottom: "130px" }}>
      <h2>ניהול משתתפים</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>מספר משתתף</TableCell>
              <TableCell>שם </TableCell>
              <TableCell>מלך שערים</TableCell>
              <TableCell>קבוצה מנצחת</TableCell>
              <TableCell>נקודות</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant, index) => (
              <TableRow key={participant._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{participant.userName}</TableCell>
                <TableCell>
                  <Avatar
                    src={`${API_URL}/${participant.scorerImage}`}
                    alt="Top Scorer"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>
                  <Avatar
                    src={`${API_URL}/${participant.winnerImage}`}
                    alt="Winner Team"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{participant.points}</TableCell>
                <TableCell>
                  {/* כפתור נחש משחקים עבור מנהל או משתמש המחובר עצמו */}
                  {(currentUser?.role === "admin" || currentUser?.id === participant._id) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleGuessGames(participant._id)}
                      sx={{ marginRight: 1 }}
                    >
                      נחש משחקים
                    </Button>
                  )}
                  {/* אייקון הפח מופיע רק עבור מנהל */}
                  {currentUser?.role === "admin" && (
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(participant)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* חלון אישור למחיקה */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"אישור מחיקה"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            האם אתה בטוח שברצונך למחוק את המשתמש {selectedParticipant?.userName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            ביטול
          </Button>
          <Button onClick={handleDeleteParticipant} color="secondary" autoFocus>
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      {/* הודעות חטף (Snackbar) */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Participants;

