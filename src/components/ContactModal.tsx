import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import Button from "./Button";
import { CONTACT_ENDPOINT, CONTACT_PHONE } from "../config";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Advisor the visitor asked for. Blank when opened from a generic CTA. */
  advisor?: string;
}

export interface ContactFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  /** Name of the requested advisor, or "" if none was specified. */
  advisor: string;
  /** Honeypot. Always empty for real people; bots fill it in. */
  company: string;
}

/**
 * Delivers a contact form submission to the Google Apps Script web app,
 * which emails it onward. Throws on failure so the modal shows its error
 * state.
 *
 * The body is sent as text/plain on purpose. That keeps it a "simple" CORS
 * request, so the browser skips the preflight OPTIONS call that Apps Script
 * cannot respond to.
 */
async function submitContactForm(values: ContactFormValues): Promise<void> {
  if (!CONTACT_ENDPOINT) {
    throw new Error("Contact endpoint is not configured.");
  }

  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(values),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || "Submission was rejected.");
  }
}

export default function ContactModal({ isOpen, onClose, advisor = "" }: ContactModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset back to a blank form the next time the modal is opened.
  useEffect(() => {
    if (!isOpen) return;
    setSubmitting(false);
    setSucceeded(false);
    setError(null);
  }, [isOpen]);

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);

    try {
      await submitContactForm({
        firstName: String(data.get("firstName") ?? ""),
        lastName: String(data.get("lastName") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        consent: data.get("consent") === "on",
        advisor,
        company: String(data.get("company") ?? ""),
      });
      setSucceeded(true);
    } catch (err) {
      console.error("[ContactModal] submission failed:", err);
      setError(`Something went wrong. Please call us at ${CONTACT_PHONE}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label="Contact us"
            className="relative w-full max-w-md bg-[#F1F3F6] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-4xl font-black text-[#191919] tracking-tight">CONTACT US</h2>
                <button
                  onClick={onClose}
                  aria-label="Close contact form"
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#191919]/50"
                >
                  <X size={24} />
                </button>
              </div>

              {succeeded ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                      <CheckCircle2 size={48} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#191919] mb-4">Message Sent!</h3>
                  <p className="text-[#191919]/60 mb-8">
                    Thank you for reaching out. A member of our team will get back to you shortly.
                  </p>
                  <Button onClick={onClose} className="w-full">Close</Button>
                </motion.div>
              ) : (
                <>
                  <p className="text-[#191919]/70 text-sm mb-6 font-medium leading-relaxed">
                    At Focused On Growth Financial Group we work with you to determine the method of investing most appropriate to meet your goals based on your unique circumstances and personal objectives.
                  </p>

                  {advisor && (
                    <div className="mb-8 rounded-2xl bg-[#1999f0]/10 border border-[#1999f0]/20 px-4 py-3">
                      <div className="text-[10px] font-bold text-[#191919]/50 uppercase tracking-widest mb-0.5">
                        Meeting With
                      </div>
                      <div className="text-sm font-bold text-[#191919]">{advisor}</div>
                    </div>
                  )}

                  {!advisor && <div className="mb-4" />}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/*
                      Honeypot. Hidden from people and skipped by screen
                      readers and tabbing, but bots that fill every field
                      will trip it and get their submission dropped.
                    */}
                    <div className="absolute left-[-9999px] top-0" aria-hidden="true">
                      <label htmlFor="company">Company (leave this blank)</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label htmlFor="firstName" className="block text-[10px] font-bold text-[#191919] uppercase tracking-widest mb-1">
                          First Name*
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          className="w-full bg-transparent border-b-2 border-[#191919]/10 py-2 text-[#191919] placeholder-[#191919]/30 placeholder:text-[14px] focus:border-[#1999f0] outline-none transition-colors font-medium"
                          placeholder="First name"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="lastName" className="block text-[10px] font-bold text-[#191919] uppercase tracking-widest mb-1">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          className="w-full bg-transparent border-b-2 border-[#191919]/10 py-2 text-[#191919] placeholder-[#191919]/30 placeholder:text-[14px] focus:border-[#1999f0] outline-none transition-colors font-medium"
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label htmlFor="phone" className="block text-[10px] font-bold text-[#191919] uppercase tracking-widest mb-1">
                          Phone*
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          className="w-full bg-transparent border-b-2 border-[#191919]/10 py-2 text-[#191919] placeholder-[#191919]/30 placeholder:text-[14px] focus:border-[#1999f0] outline-none transition-colors font-medium"
                          placeholder="(555) 000-0000"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="email" className="block text-[10px] font-bold text-[#191919] uppercase tracking-widest mb-1">
                          Email address*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full bg-transparent border-b-2 border-[#191919]/10 py-2 text-[#191919] placeholder-[#191919]/30 placeholder:text-[14px] focus:border-[#1999f0] outline-none transition-colors font-medium"
                          placeholder="name@email.com"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label htmlFor="message" className="block text-[10px] font-bold text-[#191919] uppercase tracking-widest mb-1">
                        What would you like to discuss
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={2}
                        className="w-full bg-transparent border-b-2 border-[#191919]/10 py-2 text-[#191919] placeholder-[#191919]/30 placeholder:text-[14px] focus:border-[#1999f0] outline-none transition-colors font-medium resize-none"
                        placeholder="Tell us more..."
                      ></textarea>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center mt-1">
                        <input
                          type="checkbox"
                          name="consent"
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-[#191919]/20 transition-all checked:bg-[#1999f0] checked:border-[#1999f0]"
                        />
                        <svg className="absolute h-4 w-4 pointer-events-none hidden peer-checked:block text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-[10px] text-[#191919]/60 font-medium leading-tight">
                        I Consent to Receive SMS Notifications, Alerts & Occasional Marketing Communication from company. Message frequency varies. You can reply STOP to unsubscribe at any time.
                      </span>
                    </label>

                    {error && (
                      <p role="alert" className="text-red-500 text-[10px] font-medium">
                        {error}
                      </p>
                    )}

                    <div className="pt-4 flex justify-center">
                      <Button
                        type="submit"
                        disabled={submitting}
                        showIcon={false}
                        className="w-full py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Sending..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
