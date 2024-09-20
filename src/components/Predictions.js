

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import axios from "axios";

const Predictions = () => {
  const { userId } = useParams(); // קבלת ID של המשתמש מהפרמטרים ב-URL
  const [predictions, setPredictions] = useState({});
  const [games, setGames] = useState([]);


  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // הבאת כל המשחקים מהשרת
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/games`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    // הבאת הניחושים של המשתמש מהשרת
    const fetchPredictions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/${userId}/predictions`
        );
        const predictionsMap = {};
        response.data.forEach((prediction) => {
          predictionsMap[prediction.gameId] = {
            home: prediction.homeScore,
            away: prediction.awayScore,
          };
        });
        setPredictions(predictionsMap);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchGames();
    fetchPredictions();
  }, [userId]);

  // פונקציה לחישוב הניקוד לפי הניחוש והתוצאה בפועל
  const calculatePoints = (game, prediction) => {
    const actualHomeScore = game.homeScore; // תוצאה בפועל של הקבוצה הביתית
    const actualAwayScore = game.awayScore; // תוצאה בפועל של הקבוצה האורחת

    if (!prediction) return 0;

    if (prediction.home == actualHomeScore && prediction.away == actualAwayScore) {
      return 3; // ניחוש מדויק
    } else if (
      (actualHomeScore - actualAwayScore) === (prediction.home - prediction.away)
    ) {
      return 1; // ניחוש על תוצאה שוות ערך (ניצחון/תיקו)
    } else {
      return 0; // ניחוש שגוי
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        הניחושים שלך לטורניר
      </Typography>
      <TableContainer sx={{ mt: 4  }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">תאריך</TableCell>
              <TableCell align="center">משחק</TableCell>
              <TableCell align="center">ניחוש</TableCell>
              <TableCell align="center">תוצאה בפועל</TableCell>
              <TableCell align="center">ניקוד</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => {
              const prediction = predictions[game._id];
              const points = calculatePoints(game, prediction);
              return (
                <TableRow key={game._id}>
                  <TableCell align="center">{new Date(game.date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Avatar
                        alt={game.homeTeam}
                        src={game.homeTeamImage}
                        sx={{ width: 30, height: 30, mr: 1 }}
                      />
                      <Typography>{game.homeTeam}</Typography>
                      <Typography sx={{ mx: 1 }}>נגד</Typography>
                      <Typography>{game.awayTeam}</Typography>
                      <Avatar
                        alt={game.awayTeam}
                        src={game.awayTeamImage}
                        sx={{ width: 30, height: 30, ml: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {prediction ? `${prediction.home} : ${prediction.away}` : 'לא ניחש'}
                  </TableCell>
                  <TableCell align="center">
                    {game.homeScore !== undefined && game.awayScore !== undefined
                      ? `${game.homeScore} : ${game.awayScore}`
                      : 'טרם הוכרע'}
                  </TableCell>
                  <TableCell align="center">
                    {game.homeScore !== undefined && game.awayScore !== undefined ? points : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Predictions;

