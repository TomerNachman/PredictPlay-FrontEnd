
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Avatar,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const GameList = ({ games, setGames }) => {
  const [newGame, setNewGame] = useState({
    date: "",
    time: "",
    homeTeam: "",
    homeTeamImage: "",
    awayTeam: "",
    awayTeamImage: "",
  });
  const [error, setError] = useState(""); // מצב הודעות שגיאה
  const [success, setSuccess] = useState(false); // מצב הודעת הצלחה
const API_URL = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/games`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [setGames]);

  const handleImageUpload = (e, team) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = `/images/teams/${file.name}`;
      setNewGame((prevState) => ({
        ...prevState,
        [`${team}Image`]: filePath, // שמירת הנתיב במקום הקובץ עצמו
      }));
    }
  };

  const addGame = async () => {
    try {
      const localDateTime = new Date(`${newGame.date}T${newGame.time}:00`);
      const response = await axios.post(`${API_URL}/games`, {
        ...newGame,
        date: localDateTime,
      });

      setGames([...games, response.data]);
      setNewGame({
        date: "",
        time: "",
        homeTeam: "",
        homeTeamImage: "",
        awayTeam: "",
        awayTeamImage: "",
      });
      setSuccess(true); // הצגת הודעת הצלחה
    } catch (error) {
      console.error("Error adding game:", error.response?.data || error.message);
      setError("Failed to add game. Please try again.");
    }
  };

  const deleteGame = async (id) => {
    try {
      await axios.delete(`${API_URL}/games/${id}`);
      setGames(games.filter((game) => game._id !== id));
      setSuccess(true); // הצגת הודעת הצלחה למחיקה
    } catch (error) {
      console.error("Error deleting game:", error);
      setError("Failed to delete game. Please try again.");
    }
  };

  return (
    <Box p={2}>
      <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#1976d2" }}>
        ניהול משחקים
      </h2>
      {userRole === "admin" && (
        <Box
          display="flex"
          gap="16px"
          mb={3}
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            label="תאריך"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newGame.date}
            onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="שעה"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={newGame.time}
            onChange={(e) => setNewGame({ ...newGame, time: e.target.value })}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="קבוצה א'"
            value={newGame.homeTeam}
            onChange={(e) => setNewGame({ ...newGame, homeTeam: e.target.value })}
            sx={{ minWidth: 180 }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ minWidth: 160 }}
          >
            העלה תמונה א'
            <input
              type="file"
              hidden
              onChange={(e) => handleImageUpload(e, "homeTeam")}
              accept="image/*"
            />
          </Button>
          <TextField
            label="קבוצה ב'"
            value={newGame.awayTeam}
            onChange={(e) => setNewGame({ ...newGame, awayTeam: e.target.value })}
            sx={{ minWidth: 180 }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ minWidth: 160 }}
          >
            העלה תמונה ב'
            <input
              type="file"
              hidden
              onChange={(e) => handleImageUpload(e, "awayTeam")}
              accept="image/*"
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={addGame}
            sx={{
              minWidth: 180,
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2196f3")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            startIcon={<AddCircleIcon />}
          >
            הוסף משחק
          </Button>
        </Box>
      )}
      <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: 2 , marginBottom:"80px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>תאריך ושעה</TableCell>
              <TableCell>קבוצה א'</TableCell>
              <TableCell>תמונה א'</TableCell>
              <TableCell>קבוצה ב'</TableCell>
              <TableCell>תמונה ב'</TableCell>
              {userRole === "admin" && <TableCell>פעולות</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow
                key={game._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <TableCell>{new Date(game.date).toLocaleString()}</TableCell>
                <TableCell>{game.homeTeam}</TableCell>
                <TableCell>
                  <Avatar
                    src={game.homeTeamImage}
                    alt={game.homeTeam}
                    sx={{ width: 50, height: 50, borderRadius: "8px" }}
                  />
                </TableCell>
                <TableCell>{game.awayTeam}</TableCell>
                <TableCell>
                  <Avatar
                    src={game.awayTeamImage}
                    alt={game.awayTeam}
                    sx={{ width: 50, height: 50, borderRadius: "8px" }}
                  />
                </TableCell>
                {userRole === "admin" && (
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deleteGame(game._id)}
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* הודעות שגיאה והצלחה */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert onClose={() => setSuccess(false)} severity="success">
            הפעולה הושלמה בהצלחה!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default GameList;
