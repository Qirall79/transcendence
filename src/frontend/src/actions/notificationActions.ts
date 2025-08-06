import { Fetcher } from "@/utils/Fetcher";

export const updateNotifications = async (resetUser?: any) => {
  try {
    const response = await Fetcher.put("/notifications/", {}, resetUser);
    const data = await response.json();

    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};

export const getNotifications = async (resetUser?: any) => {
  try {
    const response = await Fetcher.get("/notifications/", resetUser);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: "Something went wrong, please try again later!",
    };
  }
};
