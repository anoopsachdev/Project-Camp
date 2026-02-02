import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Tabs = ({ children, className }) => {
  return <div className={clsx("", className)}>{children}</div>;
};

export const TabsList = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, isActive, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-gray-950 shadow-sm"
          : "hover:bg-gray-200 hover:text-gray-900",
        className,
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
};
