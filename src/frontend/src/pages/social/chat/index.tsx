import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Smile,
  User,
  Gamepad2,
  CornerUpLeft,
  MessageSquare,
  ArrowRight,
  Info,
  X,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import useWebSocket from "react-use-websocket";
import { useLocation, useParams } from "react-router-dom";
import { Fetcher } from "@/utils/Fetcher";
import { useNavigate } from "react-router-dom";
import Picker from "emoji-picker-react";
import { useConversations } from "@/hooks/useConversations";
import { MdBlock } from "react-icons/md";
import { Link } from "react-router-dom";
import { delete_game_invite, send_game_invite } from "@/actions/gameActions";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

interface messType {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isThisYear = date.getFullYear() === now.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (isToday) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (isThisYear) {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${hours}:${minutes}`;
  } else {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }
}

const ConversationItem = ({ conversation, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 rounded-lg flex items-center gap-3 ${
      isActive
        ? "bg-black border border-gray-700"
        : "hover:bg-black/40 border border-transparent hover:border-gray-800"
    }`}
  >
    <div className="relative">
      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-800">
        <img
          src={conversation.avatar}
          alt={conversation.username}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black border border-gray-800 p-[2px]">
        <div
          className={`w-full h-full rounded-full ${
            conversation.status === "online"
              ? "bg-green-500"
              : conversation.status === "in_game"
              ? "bg-gray-400"
              : "bg-gray-500"
          }`}
        />
      </div>
    </div>

    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white truncate">
          {conversation.username}
        </p>
        <span className="text-xs text-gray-400">
          {moment(conversation.timestamp).fromNow()}
        </span>
      </div>
      <p className="text-sm text-gray-400 truncate">
        {conversation.lastMessage}
      </p>
    </div>

    {conversation.unread > 0 && !isActive && (
      <div className="px-2 py-1 rounded-full bg-red-500 text-xs font-medium text-white">
        {conversation.unread}
      </div>
    )}
  </button>
);

const Message = ({ message }) => (
  <div
    className={`flex text-wrap ${
      message.isMine ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <div className={`max-w-[70%] ${message.isMine ? "order-2" : "order-1"}`}>
      <div
        className={`rounded-lg p-3 ${
          message.isMine
            ? "bg-gray-900 border border-blue-900/40 text-white"
            : "bg-black border border-gray-800 text-white"
        }`}
      >
        <p className="text-sm break-all">{message.content}</p>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {formatTimestamp(message.timestamp)}
      </p>
    </div>
  </div>
);

const ProfileCard = ({ conversation, setConversation }) => {
  const [isChallenged, setIsChallenged] = useState(false);
  const { setUser } = useUser();

  const challengeUser = async () => {
    if (isChallenged) {
      await delete_game_invite(conversation.user_id, () => setUser(null));
      setIsChallenged(false);
      setConversation((oldState) => ({ ...oldState, game_invite: 0 }));
      return;
    }

    await send_game_invite(conversation.user_id, () => setUser(null));
    setConversation((oldState) => ({ ...oldState, game_invite: 2 }));
    setIsChallenged(true);
  };

  if (!conversation) return <></>;

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-lg bg-black border border-gray-800 p-1 mb-4">
          <img
            src={conversation.avatar}
            alt={conversation.username}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          {conversation.username}
        </h3>
        <p className="text-sm text-gray-400 mb-4">Level 42</p>

        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          <div className="text-center">
            <p className="text-white font-bold">152</p>
            <p className="text-xs text-gray-400">Matches</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold">89</p>
            <p className="text-xs text-gray-400">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold">2150</p>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          {conversation.game_invite === 1 ? (
            <Link to={"/dashboard/users/" + conversation.user_id}>
              <button className="flex-1 gap-2 px-3 py-2 rounded-lg bg-black border border-gray-800 text-white hover:border-gray-700">
                <Gamepad2 className="w-4 h-4 inline mr-2" />
                View challenge
              </button>
            </Link>
          ) : (
            <button
              onClick={challengeUser}
              className="flex-1 gap-2 px-3 py-2 rounded-lg bg-black border border-gray-800 text-white hover:border-gray-700"
            >
              <Gamepad2 className="w-4 h-4 inline mr-2" />
              {conversation.game_invite === 2
                ? "Cancel challenge"
                : "Challenge"}
            </button>
          )}

          <Link to={"/dashboard/users/" + conversation.user_id}>
            <button className="flex-1 gap-2 px-3 py-2 rounded-lg bg-black border border-gray-800 text-white hover:border-gray-700">
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const { user, setUser } = useUser();
  const { id } = useParams();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const {
    conversations,
    setConversations,
    revalidateConversations,
    isLoading,
  } = useConversations();
  const [Messages, setMessages] = useState<messType[]>([]);
  const navigate = useNavigate();
  const lastMsgRef = useRef(null);
  const socketRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const [searchedUser, setSearchedUser] = useState("");

  const { sendMessage, lastMessage, getWebSocket, readyState } = useWebSocket(
    `wss://${import.meta.env.VITE_IP_ADDRESS}:8081/ws/chat/`,
    {
      onOpen: () => {},
      onClose: () => {},
      onError: (err) => {},
    }
  );

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data as string);
      const { id, sender, conversation_id, content, timestamp, isMine } = data;

      if (activeConversation?.id === conversation_id || isMine) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id, sender, content, timestamp, isMine },
        ]);
      }

      revalidateConversations();
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!id) {
      setActiveConversation(null);
      return;
    }

    socketRef.current = new WebSocket(
      `wss://${import.meta.env.VITE_IP_ADDRESS}:8081/ws/profile/${id}/`
    );

    socketRef.current.onopen = (e: Event) => {};

    socketRef.current.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const update = data?.update;

      if (update && activeConversation) {
        const type = update.type;

        if (type === "block") {
          setActiveConversation((oldState) => ({
            ...oldState,
            is_blocking: true,
          }));
        }
        if (type === "unblock") {
          setActiveConversation((oldState) => ({
            ...oldState,
            is_blocking: false,
          }));
        }
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
  }, [id, pathname]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
    }
  }, [activeConversation]);

  useEffect(() => {
    if (conversations && !isLoading) {
      conversations.forEach((item) => {
        if (item.user_id === id) {
          setActiveConversation(item);
          updateReadMsgs(item.id);
          revalidateConversations();
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView();
    }
    if (activeConversation) updateReadMsgs(activeConversation.id);
  }, [Messages]);

  useEffect(() => {
    revalidateConversations();
  }, []);

  const handleSendMessage = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messageInput?.trim()) {
      const messageData = {
        message: messageInput,
        userId: id,
        conversationId: activeConversation.id,
        my_user_id: user?.id,
      };

      sendMessage(JSON.stringify(messageData));
      setMessageInput("");
    }
  };

  const updateReadMessages = async (id: any, resetUser?: any) => {
    try {
      let body = {
        id: id,
      };
      const response = await Fetcher.put(
        "/api/readed_msgs/",
        { body },
        resetUser
      );
      const data = await response.json();

      return data;
    } catch (error) {
      return {
        error: "Something went wrong, please try again later!",
      };
    }
  };

  const updateReadMsgs = async (id: any) => {
    await updateReadMessages(id, () => setUser(null));
    revalidateConversations();
  };

  const getMessages = async (resetUser?: any) => {
    try {
      const response = await Fetcher.get(
        `/api/messages/${activeConversation.id}`,
        resetUser
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  };

  const fetchMessages = async () => {
    const mess = await getMessages(() => setUser(null));

    setMessages(mess);
    updateReadMsgs(activeConversation.id);
  };

  const handleClickConv = (conversation) => {
    setActiveConversation(conversation);
    navigate(`/dashboard/chat/${conversation.user_id}`);
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessageInput((prevInput) => prevInput + event.emoji);
  };

  const openMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileInfo = () => {
    setShowProfileInfo(!showProfileInfo);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-104px)]">
        <div className="h-full flex">
          <div
            className={`${
              activeConversation ? "hidden" : "w-full"
            } lg:block lg:w-80 border-r border-gray-800 flex flex-col`}
          >
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="h-16 border-b border-gray-800 px-6 flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full bg-gray-800" />
              <Skeleton className="w-1/2 h-1/2 bg-gray-800" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-4">
              <Skeleton className="w-1/2 h-20" />
              <Skeleton className="w-1/2 h-20 translate-x-full" />
              <Skeleton className="w-1/2 h-20" />
              <Skeleton className="w-1/2 h-20 translate-x-full" />
              <Skeleton className="w-1/2 h-20" />
              <Skeleton className="w-1/2 h-20 translate-x-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-104px)]">
      <div className="h-full flex">
        
        <div
          className={`${
            activeConversation ? "hidden" : "w-full"
          } lg:block lg:w-80 border-r border-gray-800 flex flex-col`}
        >
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search conversations..."
                className="pl-9 w-full py-2 px-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                onChange={(e) => setSearchedUser(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations &&
              conversations
                .filter((item) => item.username.includes(searchedUser))
                .map((conversation, i) => (
                  <ConversationItem
                    key={i}
                    conversation={conversation}
                    isActive={activeConversation?.id === conversation.id}
                    onClick={() => handleClickConv(conversation)}
                  />
                ))}
          </div>
        </div>

        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-800 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <CornerUpLeft
                    className="w-5 h-5 text-gray-400"
                    onClick={() => {
                      setActiveConversation(null);
                      navigate(`/dashboard/chat/`);
                    }}
                  />
                </div>
                <Link to={"/dashboard/users/" + activeConversation.user_id}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg border border-gray-800 overflow-hidden">
                      <img
                        src={activeConversation.avatar}
                        alt={activeConversation.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
                <div>
                  <h2 className="font-medium text-white">
                    {activeConversation.username}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={toggleProfileInfo}
                  className="p-2 rounded-lg hover:bg-gray-900 transition-colors relative hidden lg:block"
                  aria-label="Toggle user profile information"
                >
                  {showProfileInfo ? (
                    <X className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Info className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-6 pt-6"
              onClick={(e) => {
                if (showEmoji) setShowEmoji(false);
              }}
            >
              {Messages.map((message, i) => (
                <Message key={i} message={message} />
              ))}

              <div ref={lastMsgRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              {activeConversation.is_blocking ? (
                <div className="text-center flex justify-center items-center space-x-2 text-red-500">
                  <MdBlock size={24} />
                  <p className="font-medium">You are blocked by this user</p>
                </div>
              ) : activeConversation.is_blocked ? (
                <div className="text-center flex justify-center items-center space-x-2 text-red-500">
                  <MdBlock size={24} />
                  <p className="font-medium">You are blocking this user.</p>
                  <Link
                    to={"/dashboard/users/" + activeConversation.user_id}
                    className="text-white underline"
                  >
                    Unblock
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {showEmoji && (
                    <div className="absolute bottom-20 right-4 picker-container z-10">
                      <Picker
                        onEmojiClick={onEmojiClick}
                        reactionsDefaultOpen={true}
                      />
                    </div>
                  )}
                  <button
                    className="p-2 rounded-lg hover:bg-gray-900 transition-colors"
                    onClick={() => setShowEmoji(!showEmoji)}
                  >
                    <Smile className="w-5 h-5 text-gray-400" />
                  </button>

                  <form
                    className="flex w-full gap-2"
                    onSubmit={handleSendMessage}
                  >
                    <input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 py-2 px-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                    />

                    <button className="p-2 rounded-lg bg-black border border-gray-800 text-white hover:border-gray-700">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-8 text-center">
            <div className="bg-black border border-gray-800 rounded-full p-6 mb-6">
              <MessageSquare className="w-16 h-16 text-gray-400" />
            </div>

            <h2 className="text-2xl font-bold mb-3 text-white">
              No conversation selected
            </h2>

            <p className="text-gray-400 mb-6 max-w-md">
              Select a chat from the sidebar or start a new conversation with a
              friend
            </p>

            <Link
              to="/dashboard/friends"
              className="flex items-center gap-2 px-4 py-2 bg-black border border-gray-800 hover:border-gray-700 rounded-lg transition-colors text-white"
            >
              Find friends
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {activeConversation && showProfileInfo && (
          <div className="w-0 lg:w-80 border-l border-gray-800 p-0 lg:p-4 hidden lg:block">
            <ProfileCard
              conversation={activeConversation}
              setConversation={setActiveConversation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
