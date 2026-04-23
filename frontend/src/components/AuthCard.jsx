import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import apiClient from "../services/apiClient.js";

const initialLoginState = { email: "", password: "" };
const initialRegisterState = { name: "", email: "", password: "" };

function AuthCard({ onOpenForgot }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let res;

      if (isLogin) {
        res = await apiClient.post("/auth/login", loginForm);
      } else {
        res = await apiClient.post("/auth/register", registerForm);
      }

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
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2 ${
            isLogin ? "bg-white shadow" : "text-slate-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
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

      {/* GOOGLE BUTTON */}
      {isLogin && (
        <>
          <button className="w-full mb-4 flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-slate-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-xs text-slate-400">OR</span>
            <div className="flex-1 border-t"></div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1">
        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            value={registerForm.name}
            onChange={handleRegisterChange}
            className="w-full border rounded-md px-3 py-2"
          />
        )}

        <input
          name="email"
          placeholder="Email"
          value={isLogin ? loginForm.email : registerForm.email}
          onChange={isLogin ? handleLoginChange : handleRegisterChange}
          className="w-full border rounded-md px-3 py-2"
        />

        {/* PASSWORD WITH TOGGLE */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={isLogin ? loginForm.password : registerForm.password}
            onChange={isLogin ? handleLoginChange : handleRegisterChange}
            className="w-full border rounded-md px-3 py-2 pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-slate-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* FORGOT PASSWORD */}
        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={onOpenForgot}
              className="text-sm text-emerald-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          disabled={submitting}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700"
        >
          {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

export default AuthCard;
