import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getConversations } from "@/actions/chatActions";

export const ConversationsContext = createContext<any>({});

export const ConversationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);

  const fetchData = async () => {
    const response = await getConversations(user?.id, () => setUser(null));

    if (!response || response.detail) return;

    const updatedData = response.map((item) => {
      return { ...item, timestamp: item.timestamp }; // Update the name value
    });
    setConversations(updatedData);
    setIsLoading(false);
  };

  const revalidateConversations = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user]);

  // if (!user?.id) return <>{children}</>;

  return (
    <ConversationsContext.Provider
      value={{
        setConversations,
        conversations,
        isLoading,
        revalidateConversations,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};
