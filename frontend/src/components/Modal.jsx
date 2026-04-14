import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  // Handle mount animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle ESC + focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleTab = (e) => {
      const focusable = modalRef.current?.querySelectorAll(
        "button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])",
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("keydown", handleTab);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      document.body.style.overflow = "auto";
      onClose();
    }, 200); // must match duration-200
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl 
      p-5 sm:p-8 md:p-12 
      max-h-[90vh] overflow-y-auto
      transition-all duration-200 ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-4"
      }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );

}

export default Modal;
