import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface GenreButtonProps extends HTMLMotionProps<"button"> {
  selected?: boolean;
}

const GenreButton = forwardRef<HTMLButtonElement, GenreButtonProps>(
  function GenreButton(
    { selected = false, children, className = "", ...rest },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
        px-4 py-2 rounded-full flex-none font-bold text-sm transition-all duration-200 border
        ${selected
            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
            : "bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10 hover:border-white/20"
          }
        ${className}
      `}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);

export default GenreButton;
