import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/actions/userActions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Inputs {
  password: string;
  new_password: string;
  confirmPassword: string;
  token: string;
}

export const PasswordResetForm = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (body: Inputs) => {
    if (body.confirmPassword !== body.password) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    body.token = token;
    body.new_password = body.password;
    delete body.confirmPassword;
    delete body.password;
    setIsLoading(true);
    const response = await resetPassword(body);
    setIsLoading(false);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Password reset successfully");
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      if (value.confirmPassword !== value.password) setPasswordsMatch(false);
      else setPasswordsMatch(true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-[300px] flex flex-col gap-4 relative z-50">
      <h3 className="text-xl font-semibold">Reset Password</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-2"
      >
        <div className="space-y-1">
          <Input
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
                message:
                  "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.",
              },
            })}
            type="password"
            placeholder="Password"
            autoComplete="off"
          />
          {errors.password && (
            <p className="text-xs font-semibold text-pink-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            {...register("confirmPassword", {
              required: "Password confirmation is required",
            })}
            type="password"
            placeholder="Confirm Password"
            autoComplete="off"
          />
          {errors.confirmPassword && (
            <p className="text-xs font-semibold text-pink-600">
              {errors.confirmPassword.message}
            </p>
          )}
          {!passwordsMatch && (
            <p className="text-xs font-semibold text-pink-600">
              passwords don't match
            </p>
          )}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Save
        </Button>
      </form>
    </div>
  );
};
