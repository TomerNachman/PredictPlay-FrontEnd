
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios from "axios";

const Leaderboard = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`${API_URL}/participants`); // כתובת ה-API לשליפת המשתתפים
        setParticipants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching participants:", error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const getFullImagePath = (relativePath) => {
    return `${API_URL}/${relativePath}`; // שינוי לפי הכתובת המתאימה לשרת שלך
  };

  return (
    <Box sx={{ padding: 3 , marginBottom:"130px" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#1976d2" }}>
        דירוג משתתפים
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>מיקום</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>שם</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>נקודות</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>מלך שערים</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>קבוצת מנצחת</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants
                .sort((a, b) => b.points - a.points) // סידור המשתתפים לפי נקודות
                .map((participant, index) => (
                  <TableRow
                    key={participant._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.userName}</TableCell>
                    <TableCell>{participant.points}</TableCell>
                    <TableCell>
                      <Avatar
                        src={getFullImagePath(participant.scorerImage)}
                        alt="Scorer"
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={getFullImagePath(participant.winnerImage)}
                        alt="Winner"
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Leaderboard;









