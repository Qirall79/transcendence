import { PasswordResetEmailForm } from "@/components/auth/PasswordResetEmailForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { useParams, useSearchParams } from "react-router-dom";
import Logo from "@/components/ui/Logo";

export default function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (token === null)
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={60} />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>
        <PasswordResetEmailForm />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size={60} />
        </div>
        <h1 className="text-3xl font-bold text-white">Set New Password</h1>
        <p className="text-gray-400 mt-2">
          Create a new password for your account
        </p>
      </div>
      <PasswordResetForm token={token} />
    </div>
  );
}