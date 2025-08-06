import { Fetcher } from "@/utils/Fetcher";

export const getMatchHistory = async (resetUser) => {
  try {
    const response = await Fetcher.get("/api/tictactoe/matches/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {

    console.error("Failed to get match history:", error);
    return {
      error: "Could not load your matches! 😢"
    };
  }
};

export const getPlayerStats = async (resetUser) => {
  try {
    const response = await Fetcher.get("/api/tictactoe/stats/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get player stats:", error);
    return {
      error: "Could not load your stats! 😢"
    };
  }
};

export const getLeaderboard = async (resetUser) => {
  try {
    const response = await Fetcher.get("/api/tictactoe/leaderboard/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    return {
      error: "Could not load the leaderboard! 😢"
    };
  }
};