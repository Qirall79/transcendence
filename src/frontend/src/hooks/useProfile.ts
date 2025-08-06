import { getProfile } from "@/actions/userActions";
import { useEffect, useState } from "react";
import { IProfile } from "types";
import { useUser } from "./useUser";
import { useLocation, useNavigate } from "react-router-dom";

export const useProfile = (
  id: string
): {
  profile: IProfile;
  setProfile: React.Dispatch<React.SetStateAction<IProfile>>;
  isLoading: boolean;
  revalidateProfile: any;
} => {
  const [profile, setProfile] = useState<IProfile>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user } = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setIsLoading(true);
    const profile = await getProfile(id, () => setUser(null));
    setProfile(profile);
    setIsLoading(false);
  };

  const revalidateProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (pathname.startsWith("/users/") && id === user?.id) navigate("/profile");

    if (pathname.startsWith("/dashboard/users/") && id === user?.id)
      navigate("/dashboard/profile");

    fetchProfile();
  }, [id]);

  return {
    profile,
    setProfile,
    isLoading,
    revalidateProfile,
  };
};
