import LoginForm from "@/components/auth/LoginForm";
import { useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [params] = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (error !== null) {
      if (error === '1')
        toast.error("User already exists with different provider", { id: "login-error" });
      if (error === '2')
        toast.error("Username or Email already exists", { id: "login-error" });
      else
        toast.error("Error logging in", { id: "login-error" });
    }
  }, [error]);

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
