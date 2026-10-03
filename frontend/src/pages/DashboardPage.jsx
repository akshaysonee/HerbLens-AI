import React, { useState, useEffect, useRef } from "react";
import { identifyPlant } from "../services/recognitionService.js";
import { sendChatMessage } from "../services/chatService.js";
import logo from "../assets/logo.svg";

import {
  ImagePlus,
  Camera,
  ArrowUp,
  Link,
  Leaf,
  Globe,
  Heart,
  Shield,
  FlaskConical,
  AlertTriangle,
  BookOpenText,
} from "lucide-react";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function DashboardPage() {
  const bottomRef = useRef(null);
  const uploadModalRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [identifying, setIdentifying] = useState(false);
  const [identifyError, setIdentifyError] = useState("");
  const [herbResult, setHerbResult] = useState(null);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState("");
  const [sending, setSending] = useState(false);

  const [assistantTyping, setAssistantTyping] = useState(false);


  const [herbDescription, setHerbDescription] = useState("");
  const [aiCache, setAiCache] = useState({});
  const [activeModel, setActiveModel] = useState(null);

  const icons = {
    Description: BookOpenText,
    "Native Region": Globe,
    "Traditional Uses": Leaf,
    "Medicinal Properties": FlaskConical,
    "Health Benefits": Heart,
    "Usage Instructions": Leaf,
    "Precautions / Side Effects": AlertTriangle,
    "Safety Warnings": Shield,
  };

  const sections =
    typeof herbDescription === "string"
      ? herbDescription.split("\n\n").filter((s) => s.trim() !== "")
      : [];

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 4) return "Hello 👋";
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌿";
    return "Good Evening 🌙";
  };


  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* ================= AUTO GREETING MESSAGE ================= */
  useEffect(() => {
    if (herbResult && messages.length === 0) {
      const herbName =
        herbResult?.commonName || herbResult?.plantName || "this herb";

      setAssistantTyping(true);

      const timer = setTimeout(() => {
        const autoMessage = {
          id: `auto-${Date.now()}`,
          role: "assistant",
          content: `Hi 👋, ask me anything about ${herbName}.`,
          auto: true,
        };

        setAssistantTyping(false);
        setMessages([autoMessage]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [herbResult]);


  /* ================= UPLOAD MODAL LOGIC ================= */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        uploadModalRef.current &&
        !uploadModalRef.current.contains(event.target)
      ) {
        setUploadModalOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setUploadModalOpen(false);
      }
    };

    if (uploadModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [uploadModalOpen]);

  /* ================= CAMERA PERMISSION ================= */
  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      cameraInputRef.current.click();
    } catch {
      alert("Camera permission denied.");
    }
  };

  /* ================= IMAGE HANDLING ================= */
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (identifying) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setIdentifyError("Only JPG, PNG, and WEBP images are supported.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setIdentifyError("Image is too large. Please upload an image under 5MB.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setIdentifying(true);
    setIdentifyError("");
    setHerbResult(null);
    setMessages([]);
    setActiveModel(null);

    try {
      const result = await identifyPlant(file);

      setHerbResult(result);

      const plantKey = result?.plantName;

      if (aiCache[plantKey]) {
        setHerbDescription(aiCache[plantKey]);
      } else {
        /* ================= AI DESCRIPTION ================= */
        try {
          const aiResponse = await sendChatMessage({
            herbName: result?.plantName,
            herbDetails: {
              commonName: result?.commonName,
              family: result?.family,
              genus: result?.genus,
              observationOrgan: result?.observationOrgan,
              confidence: result?.confidence,
              wikipediaUrl: result?.wikipediaUrl,
            },
            question: "Provide full herb information with all sections.",
            activeModel,
          });

          const description = aiResponse?.response || "";

          setHerbDescription(description);

          if (aiResponse?.usedModel) {
            setActiveModel(aiResponse.usedModel);
          }

          if (description && plantKey) {
            setAiCache((prev) => ({
              ...prev,
              [plantKey]: description,
            }));
          }
        } catch {
          setHerbDescription("");
        }
      }
    } catch (err) {
      setIdentifyError(
        err?.response?.data?.message ||
          "Invalid image detected. Please upload a clear plant image."
      );
    } finally {
      setIdentifying(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    const fakeEvent = {
      target: {
        files: [file],
      },
    };

    handleImageChange(fakeEvent);
  };

  const resetDashboard = () => {
    setImagePreview("");
    setHerbResult(null);
    setMessages([]);
    setChatInput("");
    setIdentifyError("");
    setChatError("");
    setHerbDescription("");
    setActiveModel(null);

    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  /* ================= CHAT ================= */
  const handleSendMessage = async () => {
    if (!chatInput.trim() || sending) return;

    const question = chatInput.trim();

    setChatInput("");
    setChatError("");

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    const pendingAssistant = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: "Thinking…",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      pendingAssistant,
    ]);

    setSending(true);

    try {
      const response = await sendChatMessage({
        herbName: herbResult?.plantName,
        herbDetails: {
          commonName: herbResult?.commonName,
          family: herbResult?.family,
          genus: herbResult?.genus,
          observationOrgan: herbResult?.observationOrgan,
          confidence: herbResult?.confidence,
          wikipediaUrl: herbResult?.wikipediaUrl,
        },
        history: messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        question,
        activeModel,
      });

      if (response?.usedModel) {
        setActiveModel(response.usedModel);
      }

      const rawText =
        response?.response || "No response received.";

      const text = rawText
        .replace(/\*\s/g, "\n• ")
        .replace(/•/g, "\n• ")
        .replace(/\n{2,}/g, "\n")
        .replace(/\n•\s*\n/g, "\n")
        .replace(
          /(Description|Native Region|Traditional Uses|Medicinal Properties|Health Benefits|Usage Instructions|Precautions \/ Side Effects|Safety Warnings):/g,
          "\n\n$1:"
        )
        .trim();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingAssistant.id
            ? {
                ...m,
                content: text,
              }
            : m
        )
      );
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message.";

      setMessages((prev) => [
        ...prev.filter(
          (m) => m.id !== pendingAssistant.id
        ),
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4fbf9]">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 flex items-center px-4 sm:px-6 py-3 border-b border-slate-200 bg-[#f4fbf9]">

        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-8"
          />

          <span className="text-lg font-semibold">
            HerbLens{" "}
            <span className="text-emerald-600">
              AI
            </span>
          </span>
        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 px-4 sm:px-6 py-10 pb-32 ${
          !herbResult && !identifying
            ? "flex items-center justify-center"
            : ""
        }`}
      >
        <div className="mx-auto w-full max-w-5xl">

          {/* Greeting Section */}
          {!herbResult && !identifying && (
            <div className="mb-12 text-center">

              <h1 className="greeting-font text-4xl sm:text-5xl font-medium tracking-tight text-slate-800">
                {getGreeting()}
              </h1>

              <p className="mt-4 text-slate-500 text-lg">
                Ready to identify and explore a new herb today?
              </p>

            </div>
          )}

          {/* INITIAL UPLOAD STATE */}
          {!herbResult && !identifying && (
            <div className="space-y-6">

              {identifyError && (
                <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-3xl xl:max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
                  {identifyError}
                </div>
              )}

              <div
                onClick={() => {
                  setIdentifyError("");
                  setUploadModalOpen(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`mx-auto flex h-52 w-full max-w-md sm:max-w-lg lg:max-w-3xl xl:max-w-4xl cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed transition ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/40"
                }`}
              >
                <ImagePlus
                  size={28}
                  className="mb-3 text-emerald-600"
                />

                <span className="font-medium text-slate-700">
                  Upload or Capture Herb Image
                </span>

                <span className="text-xs text-slate-500">
                  Drag & drop or click to upload
                </span>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {identifying && (
            <div className="flex flex-col items-center gap-4 mt-10">

              <div className="h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />

              <p className="text-slate-500 text-sm">
                Identifying herb...
              </p>

            </div>
          )}

          {/* RESULT STATE */}
          {herbResult && !identifying && (
            <div className="w-full space-y-8">

              {/* ================= RESULT CARD ================= */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex gap-4">

                  {/* Image Preview */}
                  <div className="h-20 w-20 overflow-hidden rounded-xl bg-emerald-50">

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Uploaded herb"
                        className="h-full w-full object-cover"
                      />
                    )}

                  </div>

                  {/* Herb Info */}
                  <div className="flex-1">

                    {/* Name */}
                    <div className="flex items-center gap-3 flex-wrap">

                      <div className="sm:text-base md:text-lg font-semibold text-slate-900">
                        {herbResult?.commonName ||
                          herbResult?.plantName ||
                          "Unknown Herb"}
                      </div>

                    </div>

                    {/* Scientific Name */}
                    <div className="text-xs md:text-sm text-slate-500 italic mt-1">

                      <span className="font-small">
                        Scientific Name:
                      </span>{" "}

                      {herbResult?.plantName}

                    </div>

                    <div className="text-xs md:text-sm text-slate-500 italic">

                      {herbResult?.family && (
                        <div>
                          <span className="font-small">
                            Family:
                          </span>{" "}
                          {herbResult.family}
                        </div>
                      )}

                      {herbResult?.genus && (
                        <div>
                          <span className="font-small">
                            Genus:
                          </span>{" "}
                          {herbResult.genus}
                        </div>
                      )}

                      {herbResult?.observationOrgan && (
                        <div>
                          <span className="font-small">
                            Observed Organ:
                          </span>{" "}
                          {herbResult.observationOrgan}
                        </div>
                      )}

                    </div>

                    {/* Confidence Badge */}
                    <div className="mt-1">

                      {herbResult?.confidence && (
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            herbResult.confidence >= 0.75
                              ? "bg-emerald-100 text-emerald-700"
                              : herbResult.confidence >= 0.5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          Confidence:{" "}
                          {Math.round(
                            herbResult.confidence * 100
                          )}
                          %
                        </span>
                      )}

                    </div>

                    {/* Wikipedia Url */}
                    <div className="text-xs md:text-sm text-slate-500 italic">

                      {herbResult?.wikipediaUrl && (
                        <div className="mt-2">

                          <a
                            href={herbResult.wikipediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-emerald-600 font-small hover:text-emerald-700 hover:underline transition"
                          >
                            <Link size={13} />
                            View on Wikipedia
                          </a>

                        </div>
                      )}

                    </div>

                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 space-y-6">

                  {sections.map((section, index) => {

                    const lines =
                      typeof section === "string"
                        ? section.split("\n")
                        : [];

                    const title = (lines[0] || "")
                      .replace(/^#+\s*/, "")
                      .replace(/:$/, "")
                      .trim();

                    const points = lines
                      .slice(1)
                      .filter(Boolean)
                      .map((p) =>
                        p
                          .replace(/^[-*•]\s*/, "")
                          .replace(/\*\*/g, "")
                          .replace(/\*/g, "")
                          .trim()
                      );

                    const Icon =
                      icons[title] || Leaf;

                    return (
                      <div
                        key={index}
                        className="border-t border-slate-200 pt-4"
                      >

                        {/* Section Header */}
                        <div className="flex items-center gap-2 mb-2">

                          <Icon
                            size={18}
                            className="text-emerald-600"
                          />

                          <h3 className="text-sm font-semibold text-slate-900">
                            {title}
                          </h3>

                        </div>

                        {/* Description */}
                        {title === "Description" ? (
                          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                            {points.join(" ")}
                          </p>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">

                            {points.map((point, i) => (
                              <li key={i}>
                                {point.trim()}
                              </li>
                            ))}

                          </ul>
                        )}

                      </div>
                    );
                  })}

                </div>

                {/* Low Confidence Warning */}
                {herbResult?.confidence &&
                  herbResult.confidence < 0.5 && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      ⚠️ Detection confidence is low. Please
                      upload a clearer herb image for better
                      accuracy.
                    </div>
                  )}

                <button
                  onClick={resetDashboard}
                  className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
                >
                  Upload Another Herb Image
                </button>

              </div>

              {/* ================= CHAT SECTION ================= */}
              <div className="space-y-3">

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white"
                          : msg.isError
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-white text-slate-800 leading-relaxed"
                      } ${
                        msg.auto
                          ? "animate-fadeIn"
                          : ""
                      }`}
                    >
                      {msg.content}
                    </div>

                  </div>
                ))}

                {chatError && (
                  <p className="text-sm text-red-600">
                    {chatError}
                  </p>
                )}

                {assistantTyping && (
                  <div className="flex justify-start">

                    <div className="rounded-2xl bg-white border border-slate-200 px-4 py-2 shadow-sm animate-typingBubble">

                      <div className="flex items-center gap-1">

                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />

                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-150" />

                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-300" />

                      </div>

                    </div>
                  </div>
                )}

                <div ref={bottomRef} />

              </div>

            </div>
          )}

        </div>
      </main>

      {/* ================= CHAT INPUT ================= */}
      {herbResult && !identifying && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-[#f4fbf9]">

          <div className="mx-auto w-full max-w-5xl">

            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 shadow-sm">

              <input
                type="text"
                placeholder="Ask anything about this herb"
                value={chatInput}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !sending
                  ) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />

              <button
                onClick={handleSendMessage}
                disabled={sending}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60"
              >
                <ArrowUp size={16} />
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= UPLOAD MODAL ================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

          <div
            ref={uploadModalRef}
            className="w-80 rounded-2xl bg-white p-6 shadow-2xl animate-modalScale"
          >

            <button
              onClick={() => {
                galleryInputRef.current.click();
                setUploadModalOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border hover:bg-slate-50"
            >
              <ImagePlus size={18} />
              Add Image
            </button>

            <button
              onClick={() => {
                openCamera();
                setUploadModalOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border mt-3 hover:bg-slate-50"
            >
              <Camera size={18} />
              Take Photo
            </button>

          </div>
        </div>
      )}

      {/* ================= FILE INPUTS ================= */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

    </div>
  );
}

export default DashboardPage;