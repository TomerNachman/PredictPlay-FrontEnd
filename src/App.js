
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import GameList from "./components/GameList";
// import Leaderboard from "./components/Leaderboard";
// import Participants from "./components/Participants";
// import ParticipantPredictions from "./components/ParticipantPredictions";
// import AddUser from "./components/AddUser";
// import Navigation from "./components/Navigation";
// import LiveGame from "./components/LiveGame"; // ייבוא רכיב משחקים לייב
// import initialGamesData from "./data/games";

// const App = () => {
//   const [games, setGames] = useState([]);
//   const [participants, setParticipants] = useState([]);

//   useEffect(() => {
//     const storedGames = localStorage.getItem("games");
//     const storedParticipants = localStorage.getItem("participants");

//     if (storedGames) {
//       setGames(0JSON.parse(storedGames));
//     } else {
//       setGames(initialGamesData);
//     }

//     if (storedParticipants) {
//       setParticipants(JSON.parse(storedParticipants));
//     } else {
//       setParticipants([]);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("games", JSON.stringify(games));
//     localStorage.setItem("participants", JSON.stringify(participants));
//   }, [games, participants]);


//   return (
//     <Router>
//       <div className="App">
//         <Navigation />
//         <Routes>
//           <Route path="/" element={<GameList games={games} setGames={setGames} />
// } />
//           <Route path="/leaderboard" element={<Leaderboard />} />
//           <Route path="/participants" element={<Participants participants={participants} />} />
//           <Route path="/predictions/:id" element={<ParticipantPredictions games={games} />} />
//           <Route path="/add-user" element={<AddUser />} />  
//           <Route path="/live-game/:id" element={<LiveGame />} /> {/* נתיב עבור משחקים לייב */}
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./components/GameList";
import Leaderboard from "./components/Leaderboard";
import Participants from "./components/Participants";
import ParticipantPredictions from "./components/ParticipantPredictions";
import AddUser from "./components/AddUser";
import Navigation from "./components/Navigation";
import LiveGame from "./components/LiveGame"; // ייבוא רכיב משחקים לייב
import initialGamesData from "./data/games";
import Predictions from "./components/Predictions";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UserProfile from "./pages/UserProfile";

const App = () => {
  const [games, setGames] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const storedGames = localStorage.getItem("games");
    const storedParticipants = localStorage.getItem("participants");

    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      setGames(initialGamesData);
    }

    if (storedParticipants) {
      setParticipants(JSON.parse(storedParticipants));
    } else {
      setParticipants([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
    localStorage.setItem("participants", JSON.stringify(participants));
  }, [games, participants]);


  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/games" element={<GameList games={games} setGames={setGames} />} />
          <Route path="/predictions" element={<Predictions/>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/participants" element={<Participants participants={participants} />} />
          <Route path="/predictions/:id" element={<ParticipantPredictions games={games} />} />
          <Route path="/add-user" element={<AddUser />} />  
          <Route path="/live-game/:id" element={<LiveGame />} /> {/* נתיב עבור משחקים לייב */}
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/profile/:id" element={<UserProfile />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;
