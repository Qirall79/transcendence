import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { searchUsers } from "@/actions/userActions";
import { Link } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";

export const SearchUser = () => {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { setUser } = useUser();
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setInput(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const response = await searchUsers(value, () => setUser(null));
    setIsLoading(false);

    if (response.results) {
      setResults(response.results);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div
        className={`relative border ${
          isFocused ? "border-gray-700" : "border-gray-800"
        } rounded-lg`}
      >
        <div className="relative flex items-center">
          <Search
            className={`w-5 h-5 absolute left-3 ${
              isFocused ? "text-white" : "text-gray-400"
            }`}
          />

          <input
            className="w-full bg-black pl-10 pr-4 py-2 text-white placeholder-gray-400 outline-none rounded-lg"
            placeholder="Search players..."
            value={input}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
          />

          {isLoading && (
            <Loader2 className="w-5 h-5 absolute right-3 text-gray-400 animate-spin" />
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-black border border-gray-800 rounded-lg shadow-lg z-10">
          <div className="p-1">
            {results.map((user, i) => (
              <Link
                key={i}
                to={"/dashboard/users/" + user.id}
                className="flex items-center gap-3 p-2 hover:bg-black/40 hover:border hover:border-gray-800 rounded-lg"
                onClick={() => {
                  setResults([]);
                  setInput("");
                }}
              >
                <div className="w-8 h-8 overflow-hidden rounded-lg border border-gray-800">
                  <img
                    src={user.picture}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
