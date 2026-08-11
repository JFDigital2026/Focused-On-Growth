import React from "react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Top Section - White Background */}
      <div className="bg-white py-6 md:py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-row items-center justify-between gap-2 md:gap-10 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Focused On Growth Logo" 
                className="hidden lg:block max-h-20 w-auto object-contain"
              />
              <img 
                src="/images/logo-compact.png" 
                alt="Focused On Growth Logo Mobile/Tablet" 
                className="lg:hidden max-h-8 md:max-h-12 w-auto object-contain"
              />
            </div>

            {/* Office Location */}
            <div className="text-left whitespace-nowrap">
              <h4 className="font-bold text-[#191919] mb-0.5 md:mb-1 text-[8px] md:text-sm">Office:</h4>
              <address className="not-italic text-[#191919]/70 text-[7px] md:text-sm leading-tight">
                1098 Washington Crossing Rd<br />
                Suite 3B<br />
                Washington Crossing, PA 18977
              </address>
              <p className="text-[#1999f0] font-bold mt-0.5 text-[8px] md:text-sm">215-752-3409</p>
            </div>

            {/* Have Questions */}
            <div className="text-left whitespace-nowrap">
              <h4 className="font-bold text-[#191919] mb-0.5 md:mb-1 text-[8px] md:text-sm">Questions?</h4>
              <p className="text-[#1999f0] font-bold text-[8px] md:text-sm">info@focusedongrowth.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Black Background */}
      <div className="bg-[#191919] py-4 md:py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-white/60 text-[8px] md:text-sm">
            <p>
              Focused On Growth Financial Group | © {new Date().getFullYear()}
            </p>
            <div className="flex gap-2 items-center">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
