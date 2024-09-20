

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import { calculatePredictionResult, renderPointsBadge } from "../utils/utils";

const ParticipantPredictions = () => {
  const { id } = useParams(); // קבלת ה-id של המשתמש מהנתיב
  const [predictions, setPredictions] = useState({});
  const [games, setGames] = useState([]); // הוספת מצב לאחסון המשחקים מהמסד נתונים
  const [timer, setTimer] = useState({}); // הוספת מצב לאחסון זמני הספירה לאחור
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get(`${API_URL}/participants/${id}`);
        const participant = response.data;
        const predictionsMap = {};
        participant.predictions.forEach((prediction) => {
          predictionsMap[prediction.gameId] = {
            homeScore: prediction.homeScore,
            awayScore: prediction.awayScore,
          };
        });
        setPredictions(predictionsMap);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/games`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchPredictions();
    fetchGames();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      games.forEach((game) => {
        newTimers[game._id] = getTimeRemaining(game.date);
      });
      setTimer(newTimers);
    }, 1000);

    return () => clearInterval(interval); // ניקוי הטיימר כשמרכיב מתפרק
  }, [games]);

  const handlePredictionChange = (gameId, homeScore, awayScore) => {
    const updatedPredictions = { ...predictions, [gameId]: { homeScore, awayScore } };
    setPredictions(updatedPredictions);
  };

  const handleSavePrediction = async (gameId) => {
    const prediction = predictions[gameId];
    try {
      await axios.put(`${API_URL}/participants/predictions/${id}`, {
        gameId,
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
      });
      alert("Prediction saved successfully!");
    } catch (error) {
      console.error("Error saving prediction:", error);
      alert("Failed to save prediction.");
    }
  };

  const hasGameStarted = (gameDate) => {
    return new Date() >= new Date(gameDate);
  };

  const hasGameEnded = (gameDate) => {
    const gameEndTime = new Date(gameDate);
    gameEndTime.setHours(gameEndTime.getHours() + 2); // הוסף 2 שעות למשחק
    return new Date() > gameEndTime;
  };

  const calculatePoints = (game) => {
    const prediction = predictions[game._id];
    if (!prediction || !hasGameStarted(game.date)) return 0; // החזר 0 אם המשחק לא התחיל

    const color = calculatePredictionResult(
      game.homeScore,
      game.awayScore,
      parseInt(prediction.homeScore, 10),
      parseInt(prediction.awayScore, 10)
    );

    return color === "green" ? 3 : color === "yellow" ? 1 : 0;
  };

  const getColorForPoints = (points) => {
    if (points === 3) return "green";
    if (points === 1) return "yellow";
    return "red";
  };

  const getTimeRemaining = (gameDate) => {
    const now = new Date();
    const timeDiff = new Date(gameDate) - now;

    if (timeDiff <= 0) {
      return "המשחק התחיל";
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours} שעות ${minutes} דקות ${seconds} שניות`;
  };

  return (
    <Container sx={{ mt: 4, mb: "70px" }}>
      <Typography variant="h4" gutterBottom align="center">
        נחש את תוצאות המשחקים
      </Typography>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game._id}>
            <Card sx={{ boxShadow: 3, borderRadius: "12px", height: "100%" }}>
              <CardContent sx={{ padding: "16px" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                  <Avatar alt={game.homeTeam} src={game.homeTeamImage} sx={{ width: 60, height: 60, marginRight: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: "bold", mx: 1 }}>
                    {game.homeTeam}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mx: 1 }}>
                    נגד
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", mx: 1 }}>
                    {game.awayTeam}
                  </Typography>
                  <Avatar alt={game.awayTeam} src={game.awayTeamImage} sx={{ width: 60, height: 60, marginLeft: 1 }} />
                </Box>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 1 }}>
                  תאריך ושעה: {new Date(game.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
                  זמן שנותר: {timer[game._id]}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1} justifyContent="center">
                  <Grid item>
                    <TextField
                      label={`${game.homeTeam} תוצאה`}
                      variant="outlined"
                      value={predictions[game._id]?.homeScore || ""}
                      onChange={(e) =>
                        handlePredictionChange(game._id, e.target.value, predictions[game._id]?.awayScore || "")
                      }
                      sx={{ width: "80px", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      disabled={hasGameEnded(game.date)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label={`${game.awayTeam} תוצאה`}
                      variant="outlined"
                      value={predictions[game._id]?.awayScore || ""}
                      onChange={(e) =>
                        handlePredictionChange(game._id, predictions[game._id]?.homeScore || "", e.target.value)
                      }
                      sx={{ width: "80px", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      disabled={hasGameEnded(game.date)}
                    />
                  </Grid>
                </Grid>

                {hasGameStarted(game.date) && (
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
                    {renderPointsBadge(
                      getColorForPoints(calculatePoints(game)),
                      calculatePoints(game)
                    )}
                  </Box>
                )}

                {!hasGameStarted(game.date) && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSavePrediction(game._id)}
                    >
                      שמור ניחוש
                    </Button>
                  </Box>
                )}

                {hasGameStarted(game.date) && !hasGameEnded(game.date) && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/live-game/${game._id}`)}
                    >
                      עבור ללייב
                    </Button>
                  </Box>
                )}

                {hasGameEnded(game.date) && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate(`/live-game/${game._id}`)}
                    >
                      הצג תוצאה
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ParticipantPredictions;
