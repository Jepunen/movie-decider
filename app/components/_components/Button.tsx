import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { isLoading = false, children, disabled, type = "button", variant = "primary", className = "", ...rest },
  ref,
) {
  const baseStyles = "relative w-full rounded-xl font-bold text-lg p-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden";

  const variants = {
    primary: "bg-linear-to-r from-primary via-purple-500 to-pink-500 text-white shadow-lg shadow-primary/25 border-none",
    secondary: "bg-surface text-foreground border border-white/10 hover:bg-white/5",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

export default Button;
