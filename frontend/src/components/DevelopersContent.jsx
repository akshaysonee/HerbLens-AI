import React from "react";
import ModalHeader from "./ModalHeader.jsx";
import { Github, Instagram, Linkedin } from "lucide-react";

function DevelopersContent({ onClose }) {
  const developers = [
    {
      id: 1,
      name: "Vaibhav Nanda",
      role: "Mentor",
      initials: "V",
    },
    {
      id: 2,
      name: "Akshay Kumar",
      role: "Full Stack Developer",
      initials: "A",
    },
    {
      id: 3,
      name: "Suraj Kumar Chaudhary",
      role: "AI & ML Developer",
      initials: "S",
    },
    {
      id: 4,
      name: "Shubham Kumar",
      role: "Data Scientist",
      initials: "S",
    },
  ];

  return (
    <>
      <ModalHeader title="Meet The Developers" onClose={onClose} />

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="group w-[220px] h-[270px] bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col p-5"
            >
              {/* Top Section */}
              <div className="flex flex-col items-center text-center flex-grow">
                {/* Avatar */}
                <div className="mb-4">
                  <div className="p-[3px] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg font-semibold">
                      {dev.initials}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-base text-slate-800 leading-snug min-h-[40px]">
                  {dev.name}
                </h3>

                {/* Role Badge */}
                <span className="mt-3 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {dev.role}
                </span>
              </div>

              {/* Bottom Section (Always Fixed Position) */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-center gap-4">
                <button className="p-2 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition">
                  <Instagram size={18} />
                </button>

                <button className="p-2 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition">
                  <Github size={18} />
                </button>

                <button className="p-2 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition">
                  <Linkedin size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DevelopersContent;
