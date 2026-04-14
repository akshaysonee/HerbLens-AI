import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import AuthCard from "../components/AuthCard.jsx";

function HomePage({ setActiveModal }) {
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
            <AuthCard onOpenForgot={() => setActiveModal("forgot")} />
          </div>
        </div>

        {/* RIGHT VIDEO */}
        <div className="flex justify-center">
          <div className="w-full max-w-md sm:max-w-lg overflow-hidden rounded-3xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[620px] object-cover"
            >
              <source src="/leaf.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
