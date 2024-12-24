import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-md border border-neutral-300 bg-transparent transition-[color,border-color] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-neutral-800 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 hover:border-primary-700 focus-visible:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-5 py-1",
  {
    variants: {
      inputSize: {
        lg: "h-[56px] text-base",
        default: "h-[50px] text-sm",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
);
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  invalid?: boolean;
  dirty?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, invalid, inputSize, dirty, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
