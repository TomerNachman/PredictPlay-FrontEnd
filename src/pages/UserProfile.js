import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Avatar, Grid, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams(); // קבלת ה-ID של המשתמש מה-URL
  const [user, setUser] = useState(null); // אחסון נתוני המשתמש
  const [loading, setLoading] = useState(true); // תצוגת טעינה עד לטעינת הנתונים

 const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/participants/${id}`);
        setUser(response.data); // קבלת הנתונים והצגתם
        setLoading(false); // עצירת טעינת המידע
      } catch (error) {
        console.error("שגיאה בהבאת פרופיל המשתמש:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Typography>משתמש לא נמצא</Typography>;

  // חישוב סטטיסטיקות
  const totalPredictions = user.predictions.length;
  const correctPredictions = user.predictions.filter(
    (prediction) => prediction.correct === true
  ).length;
  const accuracy = ((correctPredictions / totalPredictions) * 100).toFixed(2);

  
  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: "12px" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            alt={user.userName}
            src={`${API_URL}/${user.avatar}`}
            sx={{ width: 100, height: 100, marginRight: 2 }}
          />
          <Typography variant="h4">הפרופיל של {user.userName}</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">סה"כ נקודות</Typography>
            <Typography variant="h4">{user.points}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">ניחושים מדויקים</Typography>
            <Typography variant="h4">{correctPredictions}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">אחוז דיוק</Typography>
            <Typography variant="h4">{accuracy}%</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">סה"כ ניחושים</Typography>
            <Typography variant="h4">{totalPredictions}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
