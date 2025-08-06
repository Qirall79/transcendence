import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import TwoFactor from "./pages/auth/TwoFactor";
import TwoFactorRedirect from "./pages/auth/TwoFactorRedirect";
import Users from "./pages/users/Users";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Dashboard from "./pages/dashboard";
import DashboardLayout from "./components/layouts/DashboardLayout";
import LandingPage from "./pages/public/Landing";
import ResetPassword from "./pages/auth/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import PingPongOnline from "./pages/games/pingpong/PingPongOnline";
import PingPongLocal from "./pages/games/pingpong/PingPongLocal";
import PingPongOnlineTournament from "./pages/games/pingpong/PingPongTournament";
import TournamentsDisplay from "./pages/games/pingpong/TournamentsDisplay";
import ChatPage from "./pages/social/chat";
import FriendsPage from "./pages/social/friends";
import GameCenter from "./pages/games";
import About from "./pages/public/About";
import { PingPongHub } from "./pages/games/pingpong";
import { Settings } from "./components/users/profile/ProfileSettings";
import TicTacToePage from "./pages/games/tictactoe";
import MatchHistory from "./pages/games/tictactoe/MatchHistory";
import { LeaderBoard } from "./pages/games/pingpong/LeaderBoard";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/2fa" element={<TwoFactor />} />
      <Route path="/auth/2fa/:id" element={<TwoFactorRedirect />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/offline" element={<PingPongLocal />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        {/* User Profile Routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users/:id" element={<Users />} />

        {/* Social Routes */}
        <Route path="chat/:id" element={<ChatPage />} />
        <Route path="chat/" element={<ChatPage />} />
        <Route path="friends" element={<FriendsPage />} />

        {/* Game Center Routes */}
        <Route path="games" element={<GameCenter />} />

        {/* Ping Pong Routes */}
        <Route path="games/ping_pong" element={<PingPongHub />} />
        <Route path="games/ping_pong/leaderboard" element={<LeaderBoard />} />
        <Route path="games/ping_pong/online" element={<PingPongOnline />} />
        <Route path="games/ping_pong/offline" element={<PingPongLocal />} />
        <Route
          path="games/ping_pong/tournaments"
          element={<TournamentsDisplay />}
        />
        <Route
          path="games/ping_pong/tournament"
          element={<PingPongOnlineTournament />}
        />

        {/* Tic Tac Toe Routes */}
        <Route path="games/tictactoe" element={<TicTacToePage />} />
        <Route path="games/tictactoe/history" element={<MatchHistory />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
