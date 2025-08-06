import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { sendOtpCode } from "@/actions/userActions";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const TwoFactorForm = () => {
  const { setUser } = useUser();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!code) {
      setError("*Verification code is required");
      return;
    }
    setIsLoading(true);
    setError("");

    const response = await sendOtpCode({
      code,
      id: window.sessionStorage.getItem("id"),
    });

    if (response?.id) {
      setUser(response);
      navigate("/dashboard");
    } else setError("Invalid otp code");
    setIsLoading(false);
  };

  return (
    <form className="w-full max-w-[400px] space-y-4">
      <div className="space-y-2">
        <h3>Enter 2FA code</h3>
        <Input
          autoComplete="off"
          placeholder="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && (
          <span className="text-xs text-pink-700 font-semibold">{error}</span>
        )}
      </div>
      <Button type="submit" onClick={handleSubmit}>
        {isLoading && <Loader2 className="animate-spin" />}
        Verify
      </Button>
    </form>
  );
};
