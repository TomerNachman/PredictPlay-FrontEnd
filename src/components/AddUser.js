
import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Input,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonIcon from "@mui/icons-material/Person";

const AddUser = ({ addUser }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState(""); // שדה לאימייל
  const [password, setPassword] = useState(""); // שדה לסיסמה
  const [scorerImage, setScorerImage] = useState(null);
  const [winnerImage, setWinnerImage] = useState(null);
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [error, setError] = useState(""); // מצב הודעות שגיאה
  const [success, setSuccess] = useState(false); // מצב הודעת הצלחה
  const [previewScorer, setPreviewScorer] = useState(null); // תצוגה מקדימה למבקיע
  const [previewWinner, setPreviewWinner] = useState(null); // תצוגה מקדימה לזוכה

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (userName && email && password && scorerImage && winnerImage) {
      setLoading(true); // הצגת טעינה
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email); // הוספת אימייל
      formData.append("password", password); // הוספת סיסמה
      formData.append("scorerImage", scorerImage);
      formData.append("winnerImage", winnerImage);

      try {
        const response = await axios.post(
          `${API_URL}/participants`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": localStorage.getItem("token"), // שימוש בטוקן לאימות
            },
          }
        );
        console.log("User added:", response.data);

        setUserName("");
        setEmail(""); // איפוס שדה אימייל
        setPassword(""); // איפוס שדה סיסמה
        setScorerImage(null);
        setWinnerImage(null);
        setPreviewScorer(null);
        setPreviewWinner(null);
        setSuccess(true); // הצגת הודעת הצלחה
      } catch (error) {
        console.error("Error adding user:", error);
        setError("Failed to add user. Please try again.");
      } finally {
        setLoading(false); // הסרת טעינה
      }
    } else {
      setError("Please fill all fields!");
    }
  };

  // תצוגה מקדימה של התמונות שנבחרו
  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      className="add-user-form"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        padding: "40px",
        backgroundColor: "#f0f0f0",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "auto",
        marginTop: "50px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        <PersonIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
        Add New User
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          type="text"
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          fullWidth
          margin="dense"
          helperText="Please enter a unique user name."
          error={Boolean(error && !userName)} // הצגת הודעת שגיאה במידת הצורך
        />
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="dense"
          helperText="Please enter a valid email."
          error={Boolean(error && !email)} // הצגת הודעת שגיאה במידת הצורך
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="dense"
          helperText="Please enter a secure password."
          error={Boolean(error && !password)} // הצגת הודעת שגיאה במידת הצורך
        />
        <Typography style={{ marginTop: "20px" }}>Top Scorer</Typography>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setScorerImage, setPreviewScorer)}
          required
          fullWidth
          margin="dense"
          error={Boolean(error && !scorerImage)}
        />
        {previewScorer && (
          <Avatar
            src={previewScorer}
            alt="Scorer Preview"
            style={{
              marginTop: "10px",
              width: "100px",
              height: "100px",
              borderRadius: "8px",
            }}
          />
        )}

        <Typography style={{ marginTop: "20px" }}>Winner</Typography>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setWinnerImage, setPreviewWinner)}
          required
          fullWidth
          margin="dense"
          error={Boolean(error && !winnerImage)}
        />
        {previewWinner && (
          <Avatar
            src={previewWinner}
            alt="Winner Preview"
            style={{
              marginTop: "10px",
              width: "100px",
              height: "100px",
              borderRadius: "8px",
            }}
          />
        )}

        {loading ? (
          <CircularProgress style={{ marginTop: "30px" }} />
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              marginTop: "30px",
              padding: "10px 20px",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2196f3")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <AddCircleOutlineIcon style={{ marginRight: "8px" }} />
            Add User
          </Button>
        )}
      </form>
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
            User added successfully!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default AddUser;
