

// import React from "react";
// import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
// import { jwtDecode } from "jwt-decode";

// const Navigation = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userName = localStorage.getItem("userName");
//   let userRole = null;
//   let userId = null;

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userRole = decodedToken.role;
//       userId = decodedToken.id; // הוספת userId כדי לקשר לעמוד הפרופיל של המשתמש
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     navigate("/login");
//   };

//   return (
//     <AppBar position="static" color="primary">
//       <Toolbar>
//         <IconButton edge="start" color="inherit" aria-label="menu">
//           <SportsSoccerIcon />
//         </IconButton>
//         <Typography variant="h6" style={{ flexGrow: 1 }}>
//          PredictPlay 
//         </Typography>
//         <Button color="inherit" component={Link} to="/games">
//           משחקים
//         </Button>
//         <Button color="inherit" component={Link} to="/participants">
//           משתתפים
//         </Button>
//         <Button color="inherit" component={Link} to="/predictions">
//           ניחושים
//         </Button>
//         <Button color="inherit" component={Link} to="/leaderboard">
//           דירוג
//         </Button>

//         {/* כפתור לפרופיל המשתמש */}
//         {token && (
//           <Button color="inherit" component={Link} to={`/profile/${userId}`}>
//             הפרופיל שלי
//           </Button>
//         )}

//         {userRole === "admin" && (
//           <Button color="inherit" component={Link} to="/add-user">
//             הוסף משתמש
//           </Button>
//         )}
//         {token ? (
//           <>
//             <Typography color="inherit">שלום, {userRole === "admin" ? "מנהל" : "משתתף"}</Typography>
//             <Button color="inherit" onClick={handleLogout}>
//               התנתק
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button color="inherit" component={Link} to="/login">
//               התחבר
//             </Button>
//             <Button color="inherit" component={Link} to="/register">
//               הרשמה
//             </Button>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navigation;

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  let userRole = null;
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
      userId = decodedToken.id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["משחקים", "משתתפים", "ניחושים", "דירוג"].map((text, index) => (
          <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}`}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </Drawer>
        <IconButton color="inherit" aria-label="app">
          <SportsSoccerIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          PredictPlay
        </Typography>
        {token ? (
          <>
            <Typography color="inherit">שלום, {userRole === "admin" ? "מנהל" : userName}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              התנתק
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              התחבר
            </Button>
            <Button color="inherit" component={Link} to="/register">
              הרשמה
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
