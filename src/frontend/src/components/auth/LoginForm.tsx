import React, { useState, useContext } from "react";
import { KeyRound, User, Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Si42 } from "react-icons/si";
import { AuthContext } from "@/contexts/AuthContext";
import { loginUser } from "@/actions/userActions";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import OauthButtons from "./OauthButtons";
import Logo from "@/components/ui/Logo";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Username and password required");
      
      const element = document.querySelector(".login-card");
      element?.classList.add("shake");
      setTimeout(() => element?.classList.remove("shake"), 500);
      return;
    }
    
    setIsLoading(true);
    
    const response = await loginUser({ username, password });
    setIsLoading(false);

    if (response?.id) {
      const element = document.querySelector(".login-card");
      element?.classList.add("scale-up-fade-out");

      setTimeout(() => {
        if (response["2fa"]) {
          window.sessionStorage.setItem("id", response.id);
          navigate("/auth/2fa");
        } else {
          setUser(response);
          navigate("/dashboard");
        }
      }, 500);
    } else {
      const element = document.querySelector(".login-card");
      element?.classList.add("shake");
      setTimeout(() => element?.classList.remove("shake"), 500);
      toast.error(response?.error || "Invalid Username or Password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size={80} />
          </div>
          <h1 className="text-4xl font-bold text-white">
            P0000NG
          </h1>
          <p className="text-gray-400">
            Level up your gaming experience
          </p>
        </div>

        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg login-card">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${
                  activeField === "username" ? "text-white" : "text-gray-500"
                }`}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-black text-white rounded-lg px-10 py-3 border border-gray-800 focus:border-gray-700 focus:outline-none transition-colors"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setActiveField("username")}
                  onBlur={() => setActiveField("")}
                  autoComplete="off"
                />
              </div>

              <div className="relative">
                <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${
                  activeField === "password" ? "text-white" : "text-gray-500"
                }`}>
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-black text-white rounded-lg px-10 py-3 border border-gray-800 focus:border-gray-700 focus:outline-none transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField("")}
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black border border-gray-800 hover:border-gray-700 text-white py-3 rounded-lg font-medium transition-colors relative group"
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Sign in
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">
                  Quick login
                </span>
              </div>
            </div>

            <OauthButtons />
          </form>
        </div>

        <div>
          <p className="text-center text-gray-400">
            New user?{" "}
            <Link
              to="/auth/register"
              className="text-white hover:text-gray-300 transition-colors inline-flex items-center gap-1 group"
            >
              Create an account
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </p>

          <p className="text-center text-sm text-gray-400 mt-2">
            Forgot your password?{" "}
            <Link
              to="/auth/reset-password"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Reset password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}