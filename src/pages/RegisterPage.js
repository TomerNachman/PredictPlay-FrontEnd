
import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Avatar,
  Input,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [userName, setUserName] = useState(""); // הוספת שדה לשם משתמש
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [scorerImage, setScorerImage] = useState(null);
  const [winnerImage, setWinnerImage] = useState(null);
  const [error, setError] = useState(""); // מצב הודעת שגיאה
  const [success, setSuccess] = useState(false); // מצב הודעת הצלחה
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("scorerImage", scorerImage);
    formData.append("winnerImage", winnerImage);

    try {
      const response = await axios.post(`${API_URL}/api/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000); // מעבר לעמוד ההתחברות לאחר 2 שניות
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          הרשמה
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userName"
            label="שם משתמש"
            name="userName"
            autoComplete="userName"
            autoFocus
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="כתובת אימייל"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמא"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="אשר סיסמא"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Typography style={{ marginTop: "20px" }}>מלך שערים  </Typography>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setScorerImage)}
            required
            fullWidth
            margin="dense"
          />
          <Typography style={{ marginTop: "20px" }}>קבוצה מנצחת </Typography>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setWinnerImage)}
            required
            fullWidth
            margin="dense"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
          >
            הירשם
          </Button>
          <Link href="/login" variant="body2">
            {"כבר יש לך חשבון? התחבר"}
          </Link>
        </Box>
      </Box>

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
            ההרשמה בוצעה בהצלחה!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default RegisterPage;
