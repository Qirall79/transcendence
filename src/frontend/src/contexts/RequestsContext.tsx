import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getRequests } from '@/actions/userActions';

export const RequestsContext = createContext<any>({});

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchData = async () => {
    const response = await getRequests(() => setUser(null));
    setRequests(response);
    setIsLoading(false);
  };

  const revalidateRequests = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user]);

  return (
    <RequestsContext.Provider
      value={{
        setRequests,
        requests,
        isLoading,
        revalidateRequests,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};
