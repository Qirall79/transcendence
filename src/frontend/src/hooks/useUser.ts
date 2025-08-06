import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { IUser } from "types";

export const useUser = (): {
  user: IUser;
  setUser: any;
  isLoading: boolean;
} => {
  const { user, setUser, isLoading } = useContext(AuthContext);

  return {
    user,
    setUser,
    isLoading
  };
};
