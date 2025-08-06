import { FaGoogle } from "react-icons/fa";
import { Si42 } from "react-icons/si";
import { GamingButton } from "../ui/gaming/button";

export default function OauthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <GamingButton
        type="button"
        variant="ghost"
        onClick={() =>
          (window.location.href = import.meta.env.VITE_API_URL + "/auth/42")
        }
        className="flex items-center justify-center gap-2 group"
      >
        <Si42 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </GamingButton>

      <GamingButton
        type="button"
        variant="ghost"
        onClick={() =>
          (window.location.href = import.meta.env.VITE_API_URL + "/auth/google")
        }
        className="flex items-center justify-center gap-2 group"
      >
        <FaGoogle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </GamingButton>
    </div>
  );
}
