import { TwoFactorForm } from "@/components/auth/TwoFactorForm";

export default function TwoFactor() {
  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <h1 className="absolute top-8 text-3xl font-bold">Transcendence</h1>
      <TwoFactorForm />
    </div>
  );
}
