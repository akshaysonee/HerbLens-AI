import React, { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Modal from "./Modal.jsx";
import ModalHeader from "./ModalHeader.jsx";

// ── Step 1: email input ────────────────────────────────────────────────────
function EmailStep({ onSubmit, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    onSubmit(email.trim());
  };

  return (
    <>
      <ModalHeader title="Forgot Password" onClose={onClose} />

      {/* Icon + description */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <Mail size={30} className="text-emerald-600" />
        </div>
        <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
          Enter the email address linked to your HerbLens account and we'll send
          you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none
              focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition
              ${error ? "border-red-400 bg-red-50" : "border-slate-300"}`}
          />
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white
            font-medium py-2.5 rounded-lg text-sm transition"
        >
          Send Reset Link
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-slate-500 hover:text-slate-700 py-1 transition"
        >
          Cancel
        </button>
      </form>
    </>
  );
}

// ── Step 2: success confirmation ───────────────────────────────────────────
function SuccessStep({ email, onClose, onBack }) {
  return (
    <>
      <ModalHeader title="Check Your Email" onClose={onClose} />

      <div className="flex flex-col items-center text-center py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Reset link sent!
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-1">
          We've sent a password reset link to:
        </p>
        <p className="text-emerald-700 font-semibold text-sm mb-6 break-all">
          {email}
        </p>

        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-8">
          Didn't receive it? Check your spam folder or wait a minute before
          trying again.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white
            font-medium py-2.5 rounded-lg text-sm transition mb-3"
        >
          Back to Login
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500
            hover:text-slate-700 transition"
        >
          <ArrowLeft size={14} />
          Use a different email
        </button>
      </div>
    </>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────
function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState("email"); // "email" | "success"
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = (email) => {
    setSubmittedEmail(email);
    setStep("success");
  };

  const handleClose = () => {
    onClose();
    // Reset state after modal animation finishes
    setTimeout(() => {
      setStep("email");
      setSubmittedEmail("");
    }, 250);
  };

  const handleBack = () => {
    setStep("email");
    setSubmittedEmail("");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {step === "email" ? (
        <EmailStep onSubmit={handleSubmit} onClose={handleClose} />
      ) : (
        <SuccessStep
          email={submittedEmail}
          onClose={handleClose}
          onBack={handleBack}
        />
      )}
    </Modal>
  );
}

export default ForgotPasswordModal;
