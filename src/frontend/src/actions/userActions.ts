import { IUser } from "types";
import { Fetcher } from "../utils/Fetcher";
import { uploadFile } from "@/lib/uploadImage";

export const getUser = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/auth/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getProfile = async (id: string, resetUser?: any) => {
  try {
    if (!id) return null;
    const response = await Fetcher.get("/users/" + id, resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const loginUser = async (
  body: any
): Promise<IUser | { error: string } | any> => {
  try {
    const response = await Fetcher.post("/auth/", body);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const registerUser = async (
  body: any
): Promise<IUser | { error: string } | any> => {
  try {
    const response = await Fetcher.post("/users/", body);
    const data = await response.json();

    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const updateUser = async (body: any, resetUser: any) => {
  try {
    if (body.picture) {
      const pictureUrl = await uploadFile(body.picture);
      body.picture = pictureUrl;
    }

    const response = await Fetcher.put("/users/", body, resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const logoutUser = async () => {
  await Fetcher.delete("/auth/");
};

export const sendOtpCode = async (body: any) => {
  try {
    const response = await Fetcher.post("/auth/2fa/", body);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const addFriend = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.post(
      "/invites/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();
    if (response.status === 200) data.status = "success";
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const acceptFriend = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.post(
      "/friends/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();
    if (response.status === 200) data.status = "success";
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const deleteInvite = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.delete(
      "/invites/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();

    if (response.status === 200) data.status = "success";

    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const deleteFriend = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.delete(
      "/friends/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();
    if (response.status === 200) data.status = "success";
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const blockUser = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.post(
      "/blocks/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();
    if (response.status === 200) data.status = "success";
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const unblockUser = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.delete(
      "/blocks/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();
    if (response.status === 200) data.status = "success";
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const searchUsers = async (query: string, resetUser?: any) => {
  try {
    const response = await Fetcher.get("/users?query=" + query, resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const resetPassword = async (body: any) => {
  try {
    const response = await Fetcher.put("/auth/reset-password/", body);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const requestPasswordReset = async (body: any) => {
  try {
    const response = await Fetcher.post("/auth/reset-password/", body);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const getRequests = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/invites/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const getFriends = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/friends/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const deleteUser = async () => {
  try {
    const response = await Fetcher.delete("/users/");
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const getMatches = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/matches/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

export const getUserMatches = async (id: string, resetUser?: any) => {
  try {
    const response = await Fetcher.get("/matches/" + id, resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

export const getStats = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/stats/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

export const getLeaderBoard = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/leaderboard/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
