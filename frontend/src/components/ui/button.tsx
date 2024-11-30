import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm rounded-full shadow-mui-shadow-1 duration-300 ease-in-out font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default:
          " [&_svg]:pointer-events-none [&_svg]:shrink-0	[&_svg]:hover:rotate-45 [&_svg]:focus:rotate-45 [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:transition-[transform] bg-primary-700 text-white transition-[background-color]  ease-in-out hover:bg-primary-700/85 focus:bg-primary-700/85 ",
        soft: "[&_svg]:pointer-events-none [&_svg]:shrink-0	[&_svg]:hover:rotate-45 [&_svg]:focus:rotate-45 [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:transition-[transform] bg-primary-100 text-primary-700 transition-[background-color,color] hover:bg-primary-100/85 hover:text-primary-800 focus:bg-primary-100/85 focus:text-primary-800",
        outline:
          "[&_svg]:pointer-events-none [&_svg]:shrink-0	[&_svg]:hover:rotate-45 [&_svg]:focus:rotate-45 [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:transition-[transform] bg-transparent border border-primary-700 text-primary-700 transition-[background-color] hover:bg-primary-700/10 focus:bg-primary-700/10",
        plain:
          " [&_svg]:pointer-events-none [&_svg]:shrink-0	[&_svg]:hover:rotate-45 [&_svg]:focus:rotate-45 [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:transition-[transform] bg-white text-primary-700 transition-[background-color,color] hover:bg-white/85 hover:text-primary-800 focus:bg-white/85 focus:text-primary-800",
        icon: "[&_svg]:h-4 [&_svg]:w-4",
        disabled:
          "bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none",
        db_default:
          "bg-primary-700 text-white transition-[background-color]  ease-in-out hover:bg-primary-700/85 focus:bg-primary-700/85 rounded-[8px]",
        db_outline:
          "bg-transparent border border-primary-700 text-primary-700 transition-[background-color] hover:bg-primary-700/10 focus:bg-primary-700/10 rounded-[8px]",
        db_ghost:
          "bg-transparent border border-neutral-500 text-neutral-500 transition-[background-color] hover:bg-neutral-500/10 focus:bg-neutral-500/10 rounded-[8px]",
        db_disabled:
          "border border-neutral-300 text-neutral-300 cursor-not-allowed shadow-none rounded-[8px]",
      },
      size: {
        default: "h-[40.9px] px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-[49px] px-4",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
