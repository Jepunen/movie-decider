import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface GenreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const GenreButton = forwardRef<HTMLButtonElement, GenreButtonProps>(
  function GenreButton(
    { selected = false, children, className = "", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={`
        px-2.5 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full flex-none border-2 sm:border-2 md:border-3 lg:border-6 font-semibold text-xs sm:text-sm md:text-sm lg:text-base transition-colors duration-200
        ${
          selected
            ? "bg-primary border-accent text-text"
            : "bg-secondary border-secondary text-text"
        }
        ${className}
      `}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default GenreButton;
