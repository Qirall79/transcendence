import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Mail } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/actions/userActions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Inputs {
  email: string;
}

export const PasswordResetEmailForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (body: Inputs) => {
    setIsLoading(true);
    const response = await requestPasswordReset(body);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.error);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent)
    return (
      <div className="w-full max-w-[300px] bg-black border border-gray-800 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-black border border-gray-800 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <p className="text-white">
          Password reset email has been sent successfully.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Please check your email inbox and follow the instructions to reset your password.
        </p>
      </div>
    );

  return (
    <div className="w-full max-w-[300px] bg-black border border-gray-800 rounded-lg p-6 relative z-50">
      <h3 className="text-xl font-semibold text-white mb-4">Reset Password</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-4"
      >
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              type="text"
              placeholder="Email address"
              autoComplete="off"
              className="w-full bg-black text-white rounded-lg pl-10 pr-4 py-3 border border-gray-800 focus:border-gray-700 outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-black border border-gray-800 hover:border-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};