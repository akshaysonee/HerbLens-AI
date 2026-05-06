import React from "react";
import ModalHeader from "./ModalHeader.jsx";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";

function AboutContent({ onClose }) {
  return (
    <>
      <ModalHeader title="About HerbLens AI" onClose={onClose} />

      {/* Intro Section */}
      <div className="mb-6 sm:mb-10">
        <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
          HerbLens is an AI-powered web application built using the MERN stack
          to identify medicinal herbs instantly through intelligent image
          recognition.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Feature 1 */}
        <div className="group bg-emerald-50 rounded-2xl p-4 sm:p-6 border border-emerald-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 text-emerald-600">
            <Leaf size={28} />
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-slate-800 mb-2">
            AI Recognition
          </h3>
          <p className="text-sm sm:text-sm text-slate-600 leading-relaxed">
            Advanced machine learning model detects and classifies herbs
            accurately from uploaded images.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="group bg-emerald-50 rounded-2xl p-4 sm:p-6 border border-emerald-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 text-emerald-600">
            <ShieldCheck size={28} />
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-slate-800 mb-2">
            Secure Architecture
          </h3>
          <p className="text-sm sm:text-sm text-slate-600 leading-relaxed">
            Built with JWT authentication and protected routes ensuring secure
            user access and data safety.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="group bg-emerald-50 rounded-2xl p-4 sm:p-6 border border-emerald-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 text-emerald-600">
            <Sparkles size={28} />
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-slate-800 mb-2">
            Modern Interface
          </h3>
          <p className="text-sm sm:text-sm text-slate-600 leading-relaxed">
            Clean, responsive, SaaS-style UI with smooth animations and
            intuitive user experience.
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutContent;