import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/actions/userActions";
import { SearchUser } from "@/components/users/SearchUser";
import { NotificationBadge } from "@/components/ui/NotificationBadge";
import { NotificationDropDown } from "@/components/notifications/NotificationDropDown";
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import Logo from "../ui/Logo";

export function Navbar({ toggleSidebar }) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  function handleLogout() {
    logoutUser();
    setUser(null);
    navigate("/auth/login");
  }

  if (!user) return <></>;

  return (
    <div className="sticky top-0 left-0 right-0 z-50 flex-shrink-0">
      <div className="h-16 bg-black border-b border-gray-800">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <a href="/" className="hidden md:flex items-center gap-2">
              <Logo size={40} />
              <h1 className="text-lg font-bold text-white">P0000NG</h1>
            </a>
          </div>

          <div className="flex-1 max-w-2xl px-4">
            <SearchUser />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                className="p-2 rounded hover:bg-gray-900"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {user?.unseen_notifications_count > 0 && (
                  <NotificationBadge count={user?.unseen_notifications_count} />
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 rounded-lg overflow-hidden">
                    <NotificationDropDown isVisible={showNotifications} />
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-8 bg-gray-800" />

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-900"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src={user?.picture}
                    alt={user?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-sm text-white">
                  {user?.username}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg overflow-hidden">
                    <div className="bg-black border border-gray-800 shadow-lg">
                      <div className="p-3 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={user?.picture}
                            alt={user?.username}
                            className="w-8 h-8 rounded-lg border border-gray-800"
                          />
                          <div>
                            <p className="text-sm text-white">
                              {user?.username}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-1">
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-gray-900"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-gray-900"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded text-red-400 hover:bg-gray-900"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
