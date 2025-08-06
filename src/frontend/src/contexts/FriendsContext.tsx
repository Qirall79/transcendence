import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getFriends } from '@/actions/userActions';

export const FriendsContext = createContext<any>({});

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);

  const fetchData = async () => {
    const response = await getFriends(() => setUser(null));
    setFriends(response);
    setIsLoading(false);
  };

  const revalidateFriends = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user]);

  return (
    <FriendsContext.Provider
      value={{
        setFriends,
        friends,
        isLoading,
        revalidateFriends,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
