import React, { useState } from "react";
import ModalHeader from "./ModalHeader.jsx";

function ForgotPasswordContent({ onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    // Fake delay for now (backend later)
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);

      // Auto close after 2s
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <>
      <ModalHeader title="Forgot Password" onClose={onClose} />

      {success ? (
        <div className="text-center py-12">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 text-2xl">✓</span>
          </div>

          <h2 className="text-xl font-semibold text-emerald-700 mb-2">
            Reset Link Sent
          </h2>

          <p className="text-slate-600 text-sm">
            If this email exists in our system, a reset link has been sent.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-slate-600">
            Enter your registered email address and we’ll send you a password
            reset link.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 transition ${
                error
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-emerald-400"
              }`}
              placeholder="example@email.com"
            />

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </>
  );
}

export default ForgotPasswordContent;
