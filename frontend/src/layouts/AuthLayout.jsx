import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Modal from "../components/Modal.jsx";
import AboutContent from "../components/AboutContent.jsx";
import DevelopersContent from "../components/DevelopersContent.jsx";
import ContactContent from "../components/ContactContent.jsx";
import ForgotPasswordContent from "../components/ForgotPasswordContent.jsx";

function AuthLayout({ children }) {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <div
        className={`flex min-h-screen flex-col bg-[#e5f4e6] transition-all duration-300 ease-in-out ${
          activeModal
          ? "scale-[0.98] brightness-95"
          : "scale-100 brightness-100"
        }`}
      >
        <Navbar
          onOpenAbout={() => setActiveModal("about")}
          onOpenDevelopers={() => setActiveModal("developers")}
          onOpenContact={() => setActiveModal("contact")}
        />

        <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-[#e5f4e6]">
          {React.cloneElement(children, { setActiveModal })}
        </main>

        <Footer />
      </div>

      {activeModal && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)}>
          {activeModal === "about" && (
            <AboutContent onClose={() => setActiveModal(null)} />
          )}

          {activeModal === "developers" && (
            <DevelopersContent onClose={() => setActiveModal(null)} />
          )}

          {activeModal === "contact" && (
            <ContactContent onClose={() => setActiveModal(null)} />
          )}

          {activeModal === "forgot" && (
            <ForgotPasswordContent onClose={() => setActiveModal(null)} />
          )}
        </Modal>
      )}
    </>
  );
}

export default AuthLayout;
