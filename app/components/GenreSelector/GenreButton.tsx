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
        px-4 py-2 rounded-full flex-none border-6 font-semibold text-sm transition-colors duration-200
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
