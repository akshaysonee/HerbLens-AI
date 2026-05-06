import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import AuthCard from "../components/AuthCard.jsx";
import logo from "../assets/logo.svg";

function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  // 🔄 Wait until auth state is resolved
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e5f4e6]">
        <div className="h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ✅ If user already logged in → go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-1 bg-[#e5f4e6] items-center justify-center px-4 sm:px-6 lg:px-10 py-4 sm:py-10">
      <div className="grid w-full max-w-6xl items-center gap-8 lg:gap-10 md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-600 mb-3 sm:mb-6 leading-tight">
            Identify Any Herb Instantly
          </h1>

          <div className="mx-auto md:mx-0 w-full max-w-md">
            <AuthCard />
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-md sm:max-w-lg flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/70 px-8 py-12 shadow-sm">
            <img
              src={logo}
              alt="HerbLens AI logo"
              className="h-36 w-36 sm:h-44 sm:w-44"
            />
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-slate-800">
                HerbLens AI
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Herb recognition with AI-powered plant insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
