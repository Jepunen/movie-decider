import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { isLoading = false, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className="bg-accent text-primary rounded-2xl p-2.5 w-full font-extrabold text-base transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
});

export default Button;
