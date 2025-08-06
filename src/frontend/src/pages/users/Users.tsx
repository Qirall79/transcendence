import { useProfile } from "@/hooks/useProfile";
import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/users/profile/UserProfile";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useFriends } from "@/hooks/useFriends";
import { useConversations } from "@/hooks/useConversations";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/ui/Loader";

export default function Users() {
  const { id } = useParams();
  const { profile, isLoading, setProfile, revalidateProfile } = useProfile(id);
  const { revalidateFriends } = useFriends();
  const { revalidateConversations } = useConversations();

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = new WebSocket(
      `wss://${import.meta.env.VITE_IP_ADDRESS}:8081/ws/profile/${id}/`
    );

    socketRef.current.onopen = (e: Event) => {
      if (profile && !profile.game_invite) profile.game_invite = 0;
    };

    socketRef.current.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const update = data?.update;

      if (update) {
        const type = update.type;

        if (type === "accept") {
          setProfile((oldProfile) => ({ ...oldProfile, is_friend: true }));
          revalidateConversations();
        }
        if (type === "remove") {
          setProfile((oldProfile) => ({
            ...oldProfile,
            is_friend: false,
            invite: 0,
          }));
        }

        if (type === "invite") {
          setProfile((oldProfile) => ({ ...oldProfile, invite: 1 }));
        }

        if (type === "delete") {
          setProfile((oldProfile) => ({ ...oldProfile, invite: 0 }));
        }
        if (type === "block") {
          setProfile((oldProfile) => ({
            ...oldProfile,
            error: "You are blocked by this user",
            is_friend: false,
            invite: 0,
          }));
        }
        if (type === "unblock") {
          revalidateProfile();
        }
        revalidateFriends();
      }
    };

    socketRef.current.onclose = (e: CloseEvent) => {
      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [id]);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <Loader centered size={36} text="Loading profile..." color="text-purple-500" />
    </div>
    );
  }

  if (profile?.error)
    return (
      <div className="w-full h-full flex justify-center items-center text-pink-600 font-semibold text-lg">
        {profile.error}
      </div>
    );

  return (
    <div className="flex flex-col relative p-10 space-y-10">
      <UserProfile profile={profile} setProfile={setProfile} />
    </div>
  );
}
