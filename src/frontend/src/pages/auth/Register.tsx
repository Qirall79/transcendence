import RegisterForm from "@/components/auth/RegisterForm";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function Register() {
  const [params] = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (error !== null) {
      if (error === '1')
        toast.error("User already exists", { id: "login-error" });
      else
        toast.error("Error registering user", { id: "login-error" });
    }
  }, [error]);

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <RegisterForm />
    </div>
  );
}
