
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Box,
//   Avatar,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Button,
// } from "@mui/material";
// import { calculatePredictionResult, calculateGameMinute } from "../utils/utils";
// import { jwtDecode } from "jwt-decode";

// const LiveGame = () => {
//   const { id } = useParams();
//   const [game, setGame] = useState(null);
//   const [liveScores, setLiveScores] = useState({ home: 0, away: 0 });
//   const [newScores, setNewScores] = useState({ home: "", away: "" });
//   const [participants, setParticipants] = useState([]);
//   const [games, setGames] = useState([]);
//   const API_URL = process.env.API_URL;

//   let userRole = null;
//   const token = localStorage.getItem("token");

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userRole = decodedToken.role;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }

//   const fetchParticipants = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/participants`);
//       setParticipants(response.data);
//     } catch (error) {
//       console.error("Error fetching participants:", error);
//     }
//   };

//   const fetchGame = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/games/${id}`);
//       const gameData = response.data;
//       setGame(gameData);
//       setLiveScores({
//         home: gameData.homeScore || 0,
//         away: gameData.awayScore || 0,
//       });
//     } catch (error) {
//       console.error("Error fetching game:", error);
//     }
//   };

//   const fetchAllGames = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/games`);
//       setGames(response.data);
//     } catch (error) {
//       console.error("Error fetching games:", error);
//     }
//   };

//   useEffect(() => {
//     fetchGame();
//     fetchParticipants();
//     fetchAllGames();
//   }, [id]);

//   const handleScoreChange = (team, value) => {
//     setNewScores({ ...newScores, [team]: value });
//   };

//   const calculateTotalPoints = (participant) => {
//     return participant.predictions.reduce((total, prediction) => {
//       const game = games.find((g) => g._id === prediction.gameId);
//       if (!game) return total;

//       const color = calculatePredictionResult(
//         game.homeScore,
//         game.awayScore,
//         parseInt(prediction.homeScore, 10),
//         parseInt(prediction.awayScore, 10)
//       );

//       const points = color === "green" ? 3 : color === "yellow" ? 1 : 0;
//       return total + points;
//     }, 0);
//   };

//   const updateScores = async () => {
//     const home = parseInt(newScores.home, 10);
//     const away = parseInt(newScores.away, 10);

//     if (!isNaN(home) && !isNaN(away)) {
//       setLiveScores({ home, away });

//       try {
//         await axios.put(`${API_URL}/games/${id}`, {
//           homeScore: home,
//           awayScore: away,
//         });

//         await fetchParticipants(); // עדכון המשתתפים עם הנתונים העדכניים מהשרת
//         await fetchGame(); // עדכון המשחק עם הנתונים העדכניים מהשרת

//         // עדכון הנקודות במסד הנתונים
//         const updatedParticipants = participants.map((participant) => {
//           return {
//             ...participant,
//             totalPoints: calculateTotalPoints(participant),
//           };
//         });

//         setParticipants(updatedParticipants);
//         await Promise.all(
//           updatedParticipants.map((participant) =>
//             axios.put(`${API_URL}/participants/${participant._id}`, {
//               points: participant.totalPoints,
//             })
//           )
//         );

//         // קריאה נוספת לפונקציה שמביאה את כל המשתתפים
//         fetchParticipants();

//       } catch (error) {
//         console.error("Error updating participant points:", error);
//       }
//     }
//   };

//   const getPrediction = (userId, gameId) => {
//     const participant = participants.find((p) => p._id === userId);
//     if (!participant) return null;

//     return (
//       participant.predictions.find((pred) => pred.gameId === gameId) || null
//     );
//   };

//   const renderPointsBadge = (color, points) => {
//     const colorMap = {
//       green: "success",
//       yellow: "warning",
//       red: "error",
//     };

//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: `${colorMap[color]}.main`,
//           width: 30,
//           height: 30,
//           borderRadius: "50%",
//           color: "white",
//           fontWeight: "bold",
//         }}
//       >
//         {points}
//       </Box>
//     );
//   };

//   const renderScoreBadge = (color, score) => {
//     const colorMap = {
//       green: "success",
//       yellow: "warning",
//       red: "error",
//     };

//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: `${colorMap[color]}.main`,
//           width: 40,
//           height: 25,
//           borderRadius: "10px",
//           color: "white",
//           fontWeight: "bold",
//         }}
//       >
//         {score}
//       </Box>
//     );
//   };

//   const gameMinute = game ? calculateGameMinute(game.date) : "00:00";
//   const isGameOver = gameMinute === "המשחק הסתיים";

//   const sortedParticipants = participants
//     .map((participant) => {
//       const userPrediction = getPrediction(participant._id, id);
//       if (!userPrediction) return participant;

//       const color = calculatePredictionResult(
//         liveScores.home,
//         liveScores.away,
//         parseInt(userPrediction.homeScore, 10),
//         parseInt(userPrediction.awayScore, 10)
//       );

//       const points = color === "green" ? 3 : color === "yellow" ? 1 : 0;

//       return {
//         ...participant,
//         userPrediction,
//         color,
//         points,
//         totalPoints: calculateTotalPoints(participant),
//       };
//     })
//     .sort((a, b) => b.totalPoints - a.totalPoints);

//   return (
//     <Container sx={{ mt: 4, mb: "70px" }}>
//       {game && (
//         <>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <Avatar
//               src={game.homeTeamImage}
//               sx={{ width: 60, height: 60, mx: 1 }}
//             />
//             <Typography variant="h6" sx={{ mx: 1 }}>
//               {game.homeTeam}
//             </Typography>
//             <Typography variant="h6" sx={{ mx: 1 }}>
//               {liveScores.home} : {liveScores.away}
//             </Typography>
//             <Typography variant="h6" sx={{ mx: 1 }}>
//               {game.awayTeam}
//             </Typography>
//             <Avatar
//               src={game.awayTeamImage}
//               sx={{ width: 60, height: 60, mx: 1 }}
//             />
//           </Box>
//           <Typography variant="body1" align="center" sx={{ mb: 4 }}>
//             תאריך ושעה: {new Date(game.date).toLocaleString()}
//           </Typography>
//           <Typography variant="h6" align="center" sx={{ mb: 4 }}>
//             דקה: {gameMinute}
//           </Typography>

//           {userRole === "admin" && !isGameOver && (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <TextField
//                 label={`${game.homeTeam} תוצאה`}
//                 type="number"
//                 value={newScores.home}
//                 onChange={(e) => handleScoreChange("home", e.target.value)}
//                 sx={{ mx: 1, width: 100 }}
//               />
//               <TextField
//                 label={`${game.awayTeam} תוצאה`}
//                 type="number"
//                 value={newScores.away}
//                 onChange={(e) => handleScoreChange("away", e.target.value)}
//                 sx={{ mx: 1, width: 100 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={updateScores}
//                 sx={{ mx: 1 }}
//               >
//                 עדכן תוצאה
//               </Button>
//             </Box>
//           )}

//           {userRole === "admin" && isGameOver && (
//             <Typography
//               variant="h6"
//               align="center"
//               color="error"
//               sx={{ mb: 4 }}
//             >
//               המשחק הסתיים - לא ניתן לעדכן את התוצאה
//             </Typography>
//           )}

//           <Typography variant="h5" gutterBottom align="center">
//             דירוג משתתפים
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>מיקום</TableCell>
//                   <TableCell>שם משתמש</TableCell>
//                   <TableCell>ניחוש</TableCell>
//                   <TableCell>נקודות</TableCell>
//                   <TableCell>סה"כ נקודות</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sortedParticipants.map((participant, index) => (
//                   <TableRow key={participant._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{participant.userName}</TableCell>
//                     <TableCell>
//                       {renderScoreBadge(
//                         participant.color,
//                         `${participant.userPrediction?.homeScore} : ${participant.userPrediction?.awayScore}`
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {renderPointsBadge(participant.color, participant.points)}
//                     </TableCell>
//                     <TableCell>{participant.points}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}
//     </Container>
//   );
// };

// export default LiveGame;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { calculatePredictionResult, calculateGameMinute } from "../utils/utils";
import {jwtDecode} from "jwt-decode";

const LiveGame = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [liveScores, setLiveScores] = useState({ home: 0, away: 0 });
  const [newScores, setNewScores] = useState({ home: "", away: "" });
  const [participants, setParticipants] = useState([]);

  let userRole = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/games/${id}`);
        const gameData = response.data;
        setGame(gameData);
        setLiveScores({
          home: gameData.homeScore || 0,
          away: gameData.awayScore || 0,
        });
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/participants");
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchGame();
    fetchParticipants();
  }, [id]);

  const handleScoreChange = (team, value) => {
    setNewScores({ ...newScores, [team]: value });
  };

  const updateScores = async () => {
    const home = parseInt(newScores.home, 10);
    const away = parseInt(newScores.away, 10);
  
    if (!isNaN(home) && !isNaN(away)) {
      setLiveScores({ home, away });
  
      try {
        await axios.put(`http://localhost:5000/games/${id}`, {
          homeScore: home,
          awayScore: away,
        });
  
        const updatedParticipants = participants.map((participant) => {
          const prediction = getPrediction(participant._id, game._id);
          let newPoints = participant.points;
  
          if (prediction) {
            const currentColor = calculatePredictionResult(
              liveScores.home,
              liveScores.away,
              parseInt(prediction.homeScore, 10),
              parseInt(prediction.awayScore, 10)
            );
  
            const newColor = calculatePredictionResult(
              home,
              away,
              parseInt(prediction.homeScore, 10),
              parseInt(prediction.awayScore, 10)
            );
            
            //1
            const currentPoints = currentColor === "green" ? 3 : currentColor === "yellow" ? 1 : 0;
            
            const futurePoints = newColor === "green" ? 3 : newColor === "yellow" ? 1 : 0;
  
            // עדכון הניקוד מבלי שיורד מתחת לאפס
            newPoints = Math.max(newPoints - currentPoints + futurePoints, 0);
          }
  
          return {
            ...participant,
            points: newPoints,
          };
        });
  
        updatedParticipants.sort((a, b) => b.points - a.points);
        setParticipants(updatedParticipants);
  
        await Promise.all(
          updatedParticipants.map((participant) =>
            axios.put(`http://localhost:5000/participants/${participant._id}`, {
              points: participant.points,
            })
          )
        );
      } catch (error) {
        console.error("Error updating participant points:", error);
      }
    }
  };

  const getPrediction = (userId, gameId) => {
    const participant = participants.find((p) => p._id === userId);
    if (!participant) return null;

    return (
      participant.predictions.find((pred) => pred.gameId === gameId) || null
    );
  };

  const renderPointsBadge = (color, points) => {
    const colorMap = {
      green: "success",
      yellow: "warning",
      red: "error",
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: `${colorMap[color]}.main`,
          width: 30,
          height: 30,
          borderRadius: "50%",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {points}
      </Box>
    );
  };

  const renderScoreBadge = (color, score) => {
    const colorMap = {
      green: "success",
      yellow: "warning",
      red: "error",
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: `${colorMap[color]}.main`,
          width: 40,
          height: 25,
          borderRadius: "10px",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {score}
      </Box>
    );
  };

  const gameMinute = game ? calculateGameMinute(game.date) : "00:00";
  const isGameOver = gameMinute === "המשחק הסתיים";

  const sortedParticipants = participants
    .map((participant) => {
      const userPrediction = getPrediction(participant._id, id);
      if (!userPrediction) return participant;

      const color = calculatePredictionResult(
        liveScores.home,
        liveScores.away,
        parseInt(userPrediction.homeScore, 10),
        parseInt(userPrediction.awayScore, 10)
      );
      const points = color === "green" ? 3 : color === "yellow" ? 1 : 0;

      return {
        ...participant,
        userPrediction,
        color,
        points,
      };
    })
    .sort((a, b) => b.points - a.points);

  return (
    <Container sx={{ mt: 4 }}>
      {game && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              src={game.homeTeamImage}
              sx={{ width: 60, height: 60, mx: 1 }}
            />
            <Typography variant="h6" sx={{ mx: 1 }}>
              {game.homeTeam}
            </Typography>
            <Typography variant="h6" sx={{ mx: 1 }}>
              {liveScores.home} : {liveScores.away}
            </Typography>
            <Typography variant="h6" sx={{ mx: 1 }}>
              {game.awayTeam}
            </Typography>
            <Avatar
              src={game.awayTeamImage}
              sx={{ width: 60, height: 60, mx: 1 }}
            />
          </Box>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            תאריך ושעה: {new Date(game.date).toLocaleString()}
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            דקה: {gameMinute}
          </Typography>

          {userRole === "admin" && !isGameOver && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              <TextField
                label={`${game.homeTeam} תוצאה`}
                type="number"
                value={newScores.home}
                onChange={(e) => handleScoreChange("home", e.target.value)}
                sx={{ mx: 1, width: 100 }}
              />
              <TextField
                label={`${game.awayTeam} תוצאה`}
                type="number"
                value={newScores.away}
                onChange={(e) => handleScoreChange("away", e.target.value)}
                sx={{ mx: 1, width: 100 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={updateScores}
                sx={{ mx: 1 }}
              >
                עדכן תוצאה
              </Button>
            </Box>
          )}

          {userRole === "admin" && isGameOver && (
            <Typography
              variant="h6"
              align="center"
              color="error"
              sx={{ mb: 4 }}
            >
              המשחק הסתיים - לא ניתן לעדכן את התוצאה
            </Typography>
          )}

          <Typography variant="h5" gutterBottom align="center">
            דירוג משתתפים
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>מיקום</TableCell>
                  <TableCell>שם משתמש</TableCell>
                  <TableCell>ניחוש</TableCell>
                  <TableCell>נקודות</TableCell>
                  <TableCell>סה"כ נקודות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedParticipants.map((participant, index) => (
                  <TableRow key={participant._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.userName}</TableCell>
                    <TableCell>
                      {renderScoreBadge(
                        participant.color,
                        `${participant.userPrediction?.homeScore} : ${participant.userPrediction?.awayScore}`
                      )}
                    </TableCell>
                    <TableCell>
                      {renderPointsBadge(participant.color, participant.points)}
                    </TableCell>
                    <TableCell>{participant.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default LiveGame;