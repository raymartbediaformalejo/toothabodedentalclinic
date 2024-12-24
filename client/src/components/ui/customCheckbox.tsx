import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IoMdCheckmark } from "react-icons/io";
import classes from "@/style/index.module.css";

import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  "relative rounded-[3px] transition-[box-shadow] duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "shadow-[0_0_0_1px_#D19126_inset]",
        white: "shadow-[0_0_0_1px_white_inset]",
      },
      size: {
        default: "w-[16px] h-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type TCheckBoxProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof checkboxVariants> & {
    id?: string;
    checked: boolean;
    label?: string;
  };

const Checkbox = React.forwardRef<HTMLDivElement, TCheckBoxProps>(
  ({ onChange, label, checked, id, className, variant, size }, ref) => {
    const getId = () => {
      const newId = id
        ? id?.toLowerCase().split(" ").join("-")
        : label?.toLowerCase().split(" ").join("-");

      return newId;
    };

    const newId = getId();

    return (
      <>
        {label ? (
          <div
            className={`${className ? className : ""} ${
              classes["checkbox-container"]
            } ${classes["with-label"]}`}
            onChange={onChange}
          >
            <div className={classes["input-field"]} onClick={onChange}>
              <input
                className="hidden"
                type="checkbox"
                id={newId}
                readOnly
                checked={checked}
              />
              <div className={classes["check-icon"]}>
                <IoMdCheckmark className={classes["check"]} color="white" />
              </div>
            </div>

            <label className={classes["label"]} htmlFor={newId}>
              {label}
            </label>
          </div>
        ) : (
          <div
            className={`${className ? className : ""} ${
              classes["checkbox-container"]
            }`}
            onClick={onChange}
          >
            <div className={classes["input-field"]}>
              <input
                className={classes["input"]}
                type="checkbox"
                readOnly
                id={newId}
                checked={checked}
              />
              <div ref={ref} className={classes["check-icon"]}>
                <IoMdCheckmark className={classes["check"]} color="white" />
              </div>
            </div>
            <label className={classes["label"]} htmlFor={newId}></label>
          </div>
        )}
      </>
    );
  }
);

export { Checkbox };
