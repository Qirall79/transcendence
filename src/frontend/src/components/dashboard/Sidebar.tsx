import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";
import {
  X,
  LayoutDashboard,
  Gamepad2,
  Users,
  MessageSquare,
  UserCircle,
} from "lucide-react";

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navSections = [
    {
      title: "Main Menu",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/dashboard",
          color: "indigo",
          description: "Overview & Activities",
        },
        {
          icon: Gamepad2,
          label: "Game Center",
          path: "/dashboard/games",
          color: "green",
          description: "Play & Compete",
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          icon: Users,
          label: "Friends",
          description: "Manage Friends",
          path: "/dashboard/friends",
          color: "purple",
        },
        {
          icon: MessageSquare,
          label: "Chat",
          description: "Message friends",
          path: "/dashboard/chat",
          color: "purple",
        },
      ],
    },
  ];

  const profileItems = [
    {
      icon: UserCircle,
      label: "My Profile",
      description: "Your gaming profile",
      path: "/dashboard/profile",
      color: "amber",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        absolute h-full left-0 w-80 backdrop-blur-xl bg-black/20
        border-r border-white/10  z-40
        lg:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col items-center py-8 space-y-10">
            {navSections.map((section, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center space-y-6"
              >
                <h3 className="text-base font-medium text-gray-400 w-[90%] mb-2 uppercase tracking-wider">
                  {section.title}
                </h3>

                <div className="w-full flex flex-col items-center space-y-4">
                  {section.items.map((item, i) => (
                    <NavLink
                      key={i}
                      icon={item.icon}
                      label={item.label}
                      description={item.description}
                      to={item.path}
                      color={item.color}
                      isActive={location.pathname === item.path}
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-white/10 pt-6 pb-10">
            <div className="w-full flex flex-col items-center space-y-6">
              <h3 className="text-base font-medium text-gray-400 w-[90%] mb-2 uppercase tracking-wider">
                Profile
              </h3>

              <div className="w-full flex flex-col items-center space-y-4">
                {profileItems.map((item, i) => (
                  <NavLink
                    key={i}
                    icon={item.icon}
                    label={item.label}
                    description={item.description}
                    to={item.path}
                    color={item.color}
                    isActive={location.pathname === item.path}
                    onClick={onClose}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
