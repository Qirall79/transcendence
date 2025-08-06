import { IUser } from "types";
import { Fetcher } from "../utils/Fetcher";

export const get_tournaments = async (resetUser = null) => {
  try {
    const response = await Fetcher.get("/tournaments/", resetUser);
    const data = await response.json();
    if (response.status === 200) data.status = "success";
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const check_tournament = async (id: string, resetUser = null) => {
  try {
    const response = await Fetcher.post(
      "/check_tournament/",
      {
        id,
      },
      resetUser
    );
    var data = await response.json();

    data.status = response.status;
    return data;
  } catch (error) {
    return { error: "something is wrong", status: 201 };
  }
};

export const delete_tournament = async (id: string, resetUser = null) => {
  try {
    const response = await Fetcher.delete(
      "/tournaments/",
      {
        id,
      },
      resetUser
    );
    const data = await response.json();

    if (response.status === 200) data.success = true;

    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
      success: false,
    };
  }
};

export const create_tournament = async (
  name: string,
  game: string,
  participants: number,
  resetUser = null
) => {
  try {
    const response = await Fetcher.post(
      "/tournaments/",
      {
        game,
        name,
        participants,
      },
      resetUser
    );
    const data = await response.json();

    if (response.status === 200) data.success = true;

    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
      success: false,
    };
  }
};

export const get_subscriptions = async (id: string, resetUser = null) => {
  try {
    const response = await Fetcher.post(
      "/subscriptions/",
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
      error: "something went wrong",
    };
  }
};

export const subscribe = async (id: string, resetUser = null) => {
  try {
    const response = await Fetcher.post(
      "/subscribe/",
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
      error: "something went wrong",
    };
  }
};

export const unsubscribe = async (id: string, resetUser = null) => {
  try {
    const response = await Fetcher.delete(
      "/subscribe/",
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
      error: "something went wrong",
    };
  }
};
