import { useUser } from "@/hooks/useUser";
import { useState, useRef, useEffect } from "react";
import { deleteUser, logoutUser, updateUser } from "@/actions/userActions";
import { Switch } from "../../ui/switch";
import { Si42 } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { Modal } from "../../ui/Modal";

export const Settings = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.two_factor_enabled
  );
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const uploadRef = useRef(null);

  const usernameChangeDaysLeft = 30 - getDaysSince(user?.username_last_updated);
  const pictureChangeDaysLeft = 30 - getDaysSince(user?.picture_last_updated);
  const passwordChangeDaysLeft = 7 - getDaysSince(user?.password_last_updated);

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  function handlePictureClick() {
    if (pictureChangeDaysLeft > 0) return;
    if (uploadRef.current) uploadRef.current.click();
  }

  function handleFileChange(e) {
    const files = e.target.files;
    if (files.length) {
      setPicture(files[0]);
    } else {
      setPicture(null);
    }
  }

  function handleBack() {
    navigate("/dashboard/profile");
  }

  async function handleSubmit() {
    if (password && !passwordsMatch) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    const response = await updateUser(
      {
        username,
        picture,
        password: password || undefined,
        two_factor_enabled: twoFactorEnabled,
      },
      () => setUser(null)
    );

    setIsLoading(false);

    if (response.id) {
      setUser(response);
      setPassword("");
      setConfirmPassword("");
      toast.success("Settings updated successfully");

      navigate("/dashboard/profile");
    } else {
      toast.error(
        Object.keys(response)
          .map((k) => `${k}: ${response[k]}`)
          .join(", ")
      );
    }
  }

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteUser();
    await logoutUser();
    setUser(null);
    navigate("/auth/login");
    setIsLoading(false);
  };

  if (!user) return <></>;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      <div className="bg-black border border-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-medium text-white mb-4">Profile Picture</h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={picture ? URL.createObjectURL(picture) : user.picture}
              alt="Profile"
              className="h-20 w-20 rounded-lg object-cover border border-gray-800"
            />

            <button
              onClick={handlePictureClick}
              disabled={pictureChangeDaysLeft > 0}
              className="absolute -bottom-2 -right-2 bg-black text-white p-1 rounded-full border border-gray-800 disabled:opacity-50"
            >
              <MdEdit size={16} />
            </button>

            <input
              autoComplete="off"
              type="file"
              className="hidden"
              ref={uploadRef}
              onChange={handleFileChange}
            />
          </div>

          <div>
            {pictureChangeDaysLeft > 0 && (
              <p className="text-sm text-yellow-400">
                You can change your picture in {pictureChangeDaysLeft} days
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black border border-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-medium text-white mb-4">
          Account Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                First Name
              </label>
              <input
                autoComplete="off"
                type="text"
                value={user.first_name || ""}
                disabled
                className="w-full p-2 bg-black border border-gray-800 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Last Name
              </label>
              <input
                autoComplete="off"
                type="text"
                value={user.last_name || ""}
                disabled
                className="w-full p-2 bg-black border border-gray-800 rounded text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              autoComplete="off"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={user.provider !== null || usernameChangeDaysLeft > 0}
              className="w-full p-2 bg-black border border-gray-800 rounded text-white disabled:opacity-70"
            />
            {usernameChangeDaysLeft > 0 && (
              <p className="text-sm text-yellow-400 mt-1">
                You can change your username in {usernameChangeDaysLeft} days
              </p>
            )}
          </div>

          {user.provider && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Connected Account
              </label>
              <div className="flex items-center gap-2 p-2 bg-black border border-gray-800 rounded">
                {user.provider === "42" ? (
                  <>
                    <Si42 size={20} className="text-white" />
                    <span className="text-white">Logged in with 42</span>
                  </>
                ) : (
                  <>
                    <FaGoogle size={20} className="text-white" />
                    <span className="text-white">Logged in with Google</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-black border border-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-medium text-white mb-4">Security 🔒</h2>

        <div className="space-y-4">
          {!user.provider && (
            <form>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  autoComplete="off"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={passwordChangeDaysLeft > 0}
                  className="w-full p-2 bg-black border border-gray-800 rounded text-white disabled:opacity-70"
                />
                {passwordChangeDaysLeft > 0 && (
                  <p className="text-sm text-yellow-400 mt-1">
                    You can change your password in {passwordChangeDaysLeft}{" "}
                    days
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Confirm Password
                </label>
                <input
                  autoComplete="off"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={passwordChangeDaysLeft > 0}
                  className="w-full p-2 bg-black border border-gray-800 rounded text-white disabled:opacity-70"
                />
                {!passwordsMatch && password && (
                  <p className="text-sm text-red-500 mt-1">
                    Passwords don't match
                  </p>
                )}
              </div>
            </form>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">
                Two-Factor Authentication
              </label>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
            </div>

            {twoFactorEnabled && (
              <div className="mt-4 bg-black p-4 rounded border border-gray-800">
                <p className="text-sm text-white mb-2">
                  Scan this QR code with your authenticator app:
                </p>
                <div className="bg-white p-2 inline-block rounded">
                  <QRCode
                    value={user.otp_url || "placeholder-url"}
                    size={150}
                  />
                </div>
              </div>
            )}

            <Modal
              text="Delete account"
              action={handleDelete}
              className="bg-red-800 hover:bg-red-800 transition-all px-4 py-2 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleBack}
          className="bg-black border border-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-black border border-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

function getDaysSince(dateString) {
  if (!dateString) return 31;

  const inputDate: any = new Date(dateString);
  const currentDate: any = new Date();

  inputDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const timeDifference = currentDate - inputDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}
