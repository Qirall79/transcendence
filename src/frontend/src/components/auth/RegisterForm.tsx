import React, { useState, useContext } from "react";
import { User, Mail, KeyRound, UserCircle, Loader2 } from "lucide-react";
import { registerUser } from "@/actions/userActions";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import OauthButtons from "./OauthButtons";
import Logo from "@/components/ui/Logo";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 1) {
      toast.error("Password cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      };

      const response = await registerUser(userData);

      if (response?.id) {
        const card = document.querySelector(".register-card");
        if (card) {
          card.classList.add("scale-up-fade-out");
        }

        setTimeout(() => {
          navigate("/auth/verify-email");
        }, 500);
      } else {
        const card = document.querySelector(".register-card");
        if (card) {
          card.classList.add("shake");
          setTimeout(() => card.classList.remove("shake"), 500);
        }

        toast.error(
          response.error ||
            response.email ||
            response.username ||
            "Registration failed"
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo size={80} />
          </div>
          <h1 className="text-4xl font-bold text-white">
            P0000NG
          </h1>
          <p className="text-gray-400 mt-2">
            Create your account to start your journey
          </p>
        </div>

        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg register-card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <UserCircle
                  size={18}
                  className="absolute left-3 top-3 text-gray-500"
                />
                <input
                  placeholder="First Name"
                  className="w-full bg-black text-white rounded-lg px-10 py-2 border border-gray-800 focus:border-gray-700 outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <UserCircle
                  size={18}
                  className="absolute left-3 top-3 text-gray-500"
                />
                <input
                  placeholder="Last Name"
                  className="w-full bg-black text-white rounded-lg px-10 py-2 border border-gray-800 focus:border-gray-700 outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="relative mb-4">
              <User size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                placeholder="Username"
                className="w-full bg-black text-white rounded-lg px-10 py-2 border border-gray-800 focus:border-gray-700 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="relative mb-4">
              <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-black text-white rounded-lg px-10 py-2 border border-gray-800 focus:border-gray-700 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="relative mb-4">
              <KeyRound
                size={18}
                className="absolute left-3 top-3 text-gray-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-black text-white rounded-lg px-10 py-2 border border-gray-800 focus:border-gray-700 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="relative mb-4">
              <KeyRound
                size={18}
                className="absolute left-3 top-3 text-gray-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-black text-white rounded-lg px-10 py-2 border border-gray-800 focus:border-gray-700 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="off"
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  Passwords don't match
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black border border-gray-800 hover:border-gray-700 text-white py-2 rounded-lg font-medium transition-colors mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Create Account"
              )}
            </button>

            <div className="relative my-4 border-t border-gray-800">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-black px-2 text-xs text-gray-400">
                  OR
                </span>
              </div>
            </div>
            <OauthButtons />
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-white hover:text-gray-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}