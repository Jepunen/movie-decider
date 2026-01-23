import React from 'react';

export interface PillButtonGroupProps {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
}

const PillButtonGroup = React.forwardRef<HTMLDivElement, PillButtonGroupProps>(
    function PillButtonGroup({ options, value, onChange }, ref) {
        return (
            <div ref={ref} className="inline-flex gap-1 bg-secondary p-1 rounded-full">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        type="button"
                        className={`flex-1 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                            value === option.value
                                ? 'bg-accent text-primary shadow-sm'
                                : 'text-text hover:opacity-75'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        );
    }
);

export default PillButtonGroup;
