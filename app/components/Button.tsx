import React, {ButtonHTMLAttributes, forwardRef} from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {isLoading = false, children, disabled, type = 'button', ...props},
    ref
){
    return (
        <button
            ref={ref}
            type={type}
            className="bg-accent text-primary rounded-2xl p-2.5 w-full font-extrabold text-base"
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
});

export default Button