import { useState } from "react";
import { KeyRound, UserRound } from "lucide-react";
import { authService } from "../../services/authService";
import { getApiErrorMessage } from "../../services/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function AccountSettings({ profile }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("New password must contain at least 8 characters, including a letter and a number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      const message = response.message || "Password changed. Please sign in again.";
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await logout(false);
      navigate("/login", { replace: true, state: { message } });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><UserRound size={22} /></div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Account settings</h2>
          <p className="mt-1 text-sm text-gray-500">Account details are managed in your student profile.</p>
        </div>
      </div>
      <dl className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">Name</dt><dd className="mt-1 text-sm font-medium text-slate-800">{profile.fullName || profile.user?.name}</dd></div>
        <div><dt className="text-xs text-slate-500">Email</dt><dd className="mt-1 text-sm font-medium text-slate-800">{profile.user?.email}</dd></div>
        <div><dt className="text-xs text-slate-500">Phone</dt><dd className="mt-1 text-sm font-medium text-slate-800">{profile.phoneNumber || "Not provided"}</dd></div>
        <div><dt className="text-xs text-slate-500">Role</dt><dd className="mt-1 text-sm font-medium text-slate-800">Student</dd></div>
      </dl>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound size={19} className="text-teal-700" />
          <h3 className="font-semibold text-slate-800">Change password</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Current password
            <input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            New password
            <input type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Confirm new password
            <input type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5" />
          </label>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button type="submit" disabled={isSaving} className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
            {isSaving ? "Changing password..." : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AccountSettings;
