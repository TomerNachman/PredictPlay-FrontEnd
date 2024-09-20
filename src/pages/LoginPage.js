



import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // הוספת מצב לשגיאות
  const navigate = useNavigate();


  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.userName);
        navigate("/");
      } else {
        setError("Email or password is incorrect");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed");
    }
  };

  return (
    <Container maxWidth="xs" style={{marginBottom:"70px"}}>
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
          התחברות
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="כתובת אימייל"
            name="email"
            autoComplete="email"
            autoFocus
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
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            התחבר
          </Button>
          <Link href="/register" variant="body2">
            {"אין לך חשבון? הירשם"}
          </Link>
        </Box>
      </Box>

      {/* הודעת שגיאה */}
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
    </Container>
  );
};

export default LoginPage;
