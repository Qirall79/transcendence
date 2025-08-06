import React, { useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { Link } from "react-router-dom";
import moment from "moment";

export const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { conversations } = useConversations();

  return (
    <>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            autoComplete="off"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-gray-800 text-white px-9 py-2 rounded-lg focus:border-gray-700 outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {conversations
            .filter((c) =>
              c.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((conversation, i) => (
              <Link to={`/dashboard/chat/${conversation.user_id}`} key={i}>
                <div className="w-full p-3 rounded-lg hover:bg-black/40 border border-transparent hover:border-gray-800 flex items-center gap-3">
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

                  {conversation.unread > 0 && (
                    <div className="px-2 py-1 rounded-full bg-red-500 text-xs font-medium text-white">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
          <MessageSquare className="w-10 h-10 mb-3" />
          <p className="text-center">No conversations yet</p>
          <p className="text-sm text-center mt-1">
            Start chatting with your friends!
          </p>
        </div>
      )}
    </>
  );
};
