import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import apiClient from "../services/apiClient.js";
import ForgotPasswordModal from "./ForgotPasswordModal.jsx";

const initialForm = { name: "", email: "", password: "" };

function AuthCard() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const switchMode = (next) => {
    setMode(next);
    setForm(initialForm); // clear fields so data doesn't leak between modes
    setShowPassword(false); // hide password so it isn't exposed on switch
    setError(""); // clear any stale error message
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await apiClient.post(
        isLogin ? "/auth/login" : "/auth/register",
        payload,
      );

      login(res.data.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
      {/* Tabs */}
      <div className="mb-5 flex gap-2 rounded-full bg-slate-100 p-1 text-sm">
        <button
          onClick={() => switchMode("login")}
          className={`flex-1 rounded-full py-2 ${
            isLogin ? "bg-white shadow" : "text-slate-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => switchMode("register")}
          className={`flex-1 rounded-full py-2 ${
            !isLogin ? "bg-white shadow" : "text-slate-500"
          }`}
        >
          Register
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-1">
        {isLogin ? "Welcome back" : "Create account"}
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        {isLogin
          ? "Sign in to access your dashboard."
          : "Create account to continue."}
      </p>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1">
        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />

        {/* PASSWORD WITH TOGGLE */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-slate-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot password — only shown on login */}
        {isLogin && (
          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline transition"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  );
}

export default AuthCard;
