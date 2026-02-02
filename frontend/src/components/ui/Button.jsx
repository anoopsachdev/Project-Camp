import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", isLoading, ...props },
    ref,
  ) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700",
      ghost: "hover:bg-gray-100 text-gray-700",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {props.children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
