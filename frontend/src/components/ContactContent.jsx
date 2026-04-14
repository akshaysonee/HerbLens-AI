import React, { useState } from "react";
import ModalHeader from "./ModalHeader.jsx";

function ContactContent({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.message.trim()) newErrors.message = "Message is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <ModalHeader title="Contact Us" onClose={onClose} />

      {success ? (
        <div className="text-center py-8 sm:py-12">
          <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl">
            ✓
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-emerald-700 mb-3">
            Message Sent!
          </h2>

          <p className="text-slate-600">We'll get back to you shortly.</p>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-inner">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-2.5 sm:py-3 border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-300 focus:ring-emerald-400"
                }`}
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-300 focus:ring-emerald-400"
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                  errors.message
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-300 focus:ring-emerald-400"
                }`}
                placeholder="Write your message here..."
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 rounded-xl font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ContactContent;