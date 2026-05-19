import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';
import Button from "./Button";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [state, handleSubmit] = useForm('xeelpjpz');

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
            className="relative w-full max-w-md bg-[#F1F3F6] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-4xl font-black text-[#191919] tracking-tight">CONTACT US</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#191919]/50"
                >
                  <X size={24} />
                </button>
              </div>

              {state.succeeded ? (
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
                  <p className="text-[#191919]/70 text-sm mb-10 font-medium leading-relaxed">
                    At Focused On Growth Financial Group we work with you to determine the method of investing most appropriate to meet your goals based on your unique circumstances and personal objectives.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        <ValidationError prefix="First Name" field="firstName" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
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
                        <ValidationError prefix="Last Name" field="lastName" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
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
                        <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
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
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
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
                      <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center mt-1">
                        <input 
                          type="checkbox" 
                          name="consent"
                          required 
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-[#191919]/20 transition-all checked:bg-[#1999f0] checked:border-[#1999f0]" 
                        />
                        <svg className="absolute h-4 w-4 pointer-events-none hidden peer-checked:block text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-[10px] text-[#191919]/60 font-medium leading-tight">
                        I Consent to Receive SMS Notifications, Alerts & Occasional Marketing Communication from company. Message frequency varies. You can reply STOP to unsubscribe at any time.
                      </span>
                    </label>

                    <div className="pt-4 flex justify-center">
                      <Button 
                        type="submit"
                        disabled={state.submitting}
                        showIcon={false}
                        className="w-full py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {state.submitting ? "Sending..." : "Submit"}
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
