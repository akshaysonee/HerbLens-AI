import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "../assets/logo.svg";

function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook" },
    { icon: Twitter, href: "https://www.twitter.com/", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-emerald-600">
      <div className="flex w-full flex-col gap-4 px-10 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="HerbLens AI Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-semibold text-white text-lg tracking-wide">
              HerbLens <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 text-white">
            © {year} HerbLens. All rights reserved.
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Connect With Us</h3>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="
                    p-2
                    rounded-full 
                    bg-emerald-100 
                    hover:bg-emerald-500 
                    transition-colors 
                    hover:scale-110 
                    shadow-sm hover:shadow-emerald-500/20"
              >
                <social.icon className="h-5 w-5 text-emerald-600 hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
