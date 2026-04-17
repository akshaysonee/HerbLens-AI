import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import apiClient from "../services/apiClient.js";
import logo from "../assets/logo.svg";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.put("/auth/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4fbf9]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center px-4 sm:px-6 py-3 border-b border-slate-200 bg-[#f4fbf9]">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-lg font-semibold">
            HerbLens <span className="text-emerald-600">AI</span>
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-1">Change Password</h2>
          <p className="text-sm text-slate-500 mb-6">
            Enter your current password and choose a new one.
          </p>

          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-1">
                Password Updated
              </h3>
              <p className="text-sm text-slate-500">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-8 text-slate-500"
                >
                  {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Min 8 chars, upper, lower, number, symbol"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-8 text-slate-500"
                >
                  {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-8 text-slate-500"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 transition disabled:opacity-70 text-sm font-medium"
              >
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default ChangePasswordPage;
