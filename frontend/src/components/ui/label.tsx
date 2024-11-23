import * as React from "react";

import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, isRequired = false, ...props }, ref) => (
    <>
      <label
        ref={ref}
        className={cn(
          "text-xs md:text-base font-medium text-neutral-600 leading-[14.52px] md:leading-[19.36px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}

        {isRequired ? (
          <span className="ml-1 text-red-500">*</span>
        ) : (
          <span className="ml-1 text-xs text-neutral-400 md:text-sm text-black/50">
            (optional)
          </span>
        )}
      </label>
    </>
  )
);
Label.displayName = "Label";

export { Label };
