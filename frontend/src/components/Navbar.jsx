import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.svg";

function Navbar({ onOpenAbout, onOpenDevelopers, onOpenContact }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-[#e5f4e6]">
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="HerbLens AI Logo"
            className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
          />
        
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 tracking-wide">
            HerbLens <span className="text-emerald-600">AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            type="button"
            onClick={onOpenAbout}
            className="text-slate-700 transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-[1px] hover:text-emerald-600"
          >
            About Platform
          </button>

          {/* <button
            type="button"
            onClick={onOpenDevelopers}
            className="text-slate-700 transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-[1px] hover:text-emerald-600"
          >
            Meet Developers
          </button> */}

          <button
            type="button"
            onClick={onOpenContact}
            className="text-slate-700 transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-[1px] hover:text-emerald-600"
          >
            Contact
          </button>

          <Link
            to="/dashboard"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 transition"
          >
            Try Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center h-10 w-10 text-slate-700 transition-all duration-200 ease-out active:scale-90"
          >
            <div
              className={`transition-all duration-300 ${
                isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
              }`}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 mt-2 rounded-2xl bg-white shadow-lg ring-1 ring-emerald-100 p-5 space-y-4 text-sm font-medium">
          <button
            onClick={() => {
              onOpenAbout();
              setIsOpen(false);
            }}
            className="block w-full text-left text-slate-700 hover:text-emerald-600 transition"
          >
            About Platform
          </button>
{/* 
          <button
            onClick={() => {
              onOpenDevelopers();
              setIsOpen(false);
            }}
            className="block w-full text-left text-slate-700 hover:text-emerald-600 transition"
          >
            Meet Developers
          </button> */}

          <button
            onClick={() => {
              onOpenContact();
              setIsOpen(false);
            }}
            className="block w-full text-left text-slate-700 hover:text-emerald-600 transition"
          >
            Contact
          </button>

          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center rounded-lg bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 transition"
          >
            Try Now
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;