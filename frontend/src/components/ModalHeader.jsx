import React from "react";
import { X } from "lucide-react";

function ModalHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
      <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">
        {title}
      </h1>

      <button
        onClick={onClose}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-black transition"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export default ModalHeader;
