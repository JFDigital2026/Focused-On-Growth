import React from "react";
import { ChevronRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  showIcon?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  showIcon = true,
  type = "button",
  disabled = false
}: ButtonProps) {
  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group hover:shadow-accent/30 hover:shadow-2xl
      hover:scale-[1.02] hover:-translate-y-1 active:scale-95
      transition-all duration-500 ease-out cursor-pointer
      hover:border-accent/60 overflow-hidden bg-gradient-to-br
      from-primary via-primary to-primary/90
      border-accent/30 border-2 rounded-full pt-2.5 pr-4 pb-2.5
      pl-5 relative shadow-2xl backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent
        via-accent/20 to-transparent -translate-x-full
        group-hover:translate-x-full transition-transform
        duration-1000 ease-out"></div>
      <div className="group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-r from-accent/5 via-accent/10
        to-accent/5 opacity-0 rounded-2xl absolute top-0 right-0
        bottom-0 left-0"></div>
      <div className="relative z-10 flex items-center justify-center gap-3">
        <div className="text-center">
          <div className="group-hover:text-accent transition-colors duration-300
            text-sm font-bold text-secondary drop-shadow-sm whitespace-nowrap">{children}</div>
        </div>
        {showIcon && (
          <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            <ChevronRight size={16} className="text-accent" />
          </div>
        )}
      </div>
    </button>
  );
}
