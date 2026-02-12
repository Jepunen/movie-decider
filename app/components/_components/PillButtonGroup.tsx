import React from "react";
import { motion } from "framer-motion";

export interface PillButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}

const PillButtonGroup = React.forwardRef<HTMLDivElement, PillButtonGroupProps>(
  function PillButtonGroup(
    { options, value, onChange, className = "", ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={`inline-flex p-1 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5 ${className}`}
        {...rest}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
              className={`relative flex-1 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 z-10 ${isSelected ? "text-white" : "text-foreground/60 hover:text-foreground/90"
                }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="pill-bg"
                  className="absolute inset-0 bg-primary/80 rounded-xl -z-10 shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },
);

export default PillButtonGroup;
