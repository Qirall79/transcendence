import { useUser } from "@/hooks/useUser";
import { Switch } from "../ui/switch";
import QRCode from "react-qr-code";

export const TwoFactorHandler = ({
  twoFactorEnabled,
  setTwoFactorEnabled,
}: {
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: any;
}) => {
  const { user } = useUser();

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <p className="text-sm text-slate-400">Enable 2FA</p>
        <Switch
          onCheckedChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
          checked={twoFactorEnabled}
        />
      </div>

      {twoFactorEnabled && (
        <div>
          <QRCode
            className="w-40 h-40 border-2"
            value={user.otp_url || "www.google.com"}
          />
        </div>
      )}
    </div>
  );
};
