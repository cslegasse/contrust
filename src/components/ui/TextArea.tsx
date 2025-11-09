// src/components/ui/Textarea.tsx
import React, { TextareaHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

// Tailwind variants for styling
const textareaVariants = cva(
  "block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default: "py-2 px-3",
        sm: "py-1 px-2 text-sm",
        lg: "py-3 px-4 text-lg",
      },
      variant: {
        default: "",
        outline: "border-gray-300 dark:border-gray-600",
        filled: "bg-gray-100 dark:bg-gray-700",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  size,
  variant,
  ...props
}) => {
  return <textarea className={textareaVariants({ size, variant, className })} {...props} />;
};