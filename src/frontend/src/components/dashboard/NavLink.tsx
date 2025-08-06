import React from "react";
import { Link } from "react-router-dom";

export function NavLink({
  icon: Icon,
  label,
  description,
  to,
  isActive,
  onClick,
  color = "purple",
}) {
  const colors = {
    indigo: {
      active: "from-indigo-500 to-blue-600",
      hover: "hover:from-indigo-600 hover:to-blue-700",
      icon: "text-indigo-400",
    },
    purple: {
      active: "from-purple-500 to-pink-500",
      hover: "hover:from-purple-600 hover:to-pink-600",
      icon: "text-purple-400",
    },
    green: {
      active: "from-emerald-500 to-teal-500",
      hover: "hover:from-emerald-600 hover:to-teal-600",
      icon: "text-emerald-400",
    },
    amber: {
      active: "from-amber-500 to-orange-500",
      hover: "hover:from-amber-600 hover:to-orange-600",
      icon: "text-amber-400",
    },
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        group relative flex items-center w-[90%] h-24 rounded-2xl transition-all duration-500
        overflow-hidden backdrop-blur-sm
        ${
          isActive
            ? `bg-gradient-to-r ${colors[color].active} shadow-lg`
            : `hover:bg-gradient-to-r ${colors[color].hover} bg-white/5`
        }
      `}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      <div className="relative flex items-center w-full gap-5 px-6">
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-xl ${
              isActive ? colors[color].active : ""
            } opacity-20 blur-sm`}
          ></div>
          <div
            className={`relative w-16 h-16 rounded-xl flex items-center justify-center
              ${isActive ? "bg-white/20" : "bg-white/5"}
              transition-all duration-300 group-hover:scale-110`}
          >
            <Icon
              className={`w-8 h-8 ${
                isActive ? "text-white" : colors[color].icon
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col ml-1">
          <span
            className={`font-semibold tracking-wide text-lg
              ${
                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
              }`}
          >
            {label}
          </span>
          {description && (
            <span className="text-sm text-white/60 mt-1">{description}</span>
          )}
        </div>

        {isActive && (
          <div className="ml-auto">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          </div>
        )}
      </div>
    </Link>
  );
}
