import React, { useState } from "react";
import { Users, MessageSquare, X, ChevronUp, Inbox } from "lucide-react";
import { FriendsList } from "./FriendsList";
import { ChatSidebar } from "./ChatSidebar";
import { useRequests } from "@/hooks/useRequests";
import { useConversations } from "@/hooks/useConversations";

export const InboxBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState("chat");
  const { requests } = useRequests();
  const { conversations } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations?.filter(
    (convo) =>
      convo.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total notification count - friend requests + unread messages
  const unreadMessages = conversations?.reduce(
    (total, convo) => total + (convo.unread || 0),
    0
  );
  const notificationCount = requests.length + unreadMessages;

  // Toggle the inbox open/closed
  const toggleInbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50">
      {/* Bottom bar - entire bar is clickable */}
      <div
        className="w-80 bg-black border-t border-l border-gray-800 h-12 flex items-center justify-between rounded-tl-lg overflow-hidden shadow-lg cursor-pointer hover:bg-gray-900 transition-colors"
        onClick={toggleInbox}
      >
        {/* Inbox label with notification count */}
        <div className="flex items-center gap-2 px-4">
          <div className="relative">
            <Inbox className="w-5 h-5 text-gray-400" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border border-black">
                {notificationCount}
              </span>
            )}
          </div>
          <span className="text-sm text-white font-medium">Social Inbox</span>
        </div>

        {/* Toggle indicator */}
        <div className="px-4 py-2 h-full flex items-center">
          <ChevronUp
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expandable panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-black border border-gray-800 rounded-tl-lg shadow-xl overflow-hidden">
          {/* Panel header */}
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView("chat")}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentView === "chat"
                    ? "bg-black border border-gray-700 text-white"
                    : "bg-black border border-gray-800 text-gray-400"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat
                {unreadMessages > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView("friends")}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentView === "friends"
                    ? "bg-black border border-gray-700 text-white"
                    : "bg-black border border-gray-800 text-gray-400"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Friends
                {requests.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-900"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Panel content */}
          <div className="h-80">
            {currentView === "chat" && <ChatSidebar />}
            {currentView === "friends" && <FriendsList />}
          </div>
        </div>
      )}
    </div>
  );
};
