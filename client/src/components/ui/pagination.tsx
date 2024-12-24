import * as React from "react";
import { FiMoreHorizontal } from "react-icons/fi";

import {
  RxDoubleArrowRight,
  RxDoubleArrowLeft,
  RxCaretRight,
  RxCaretLeft,
} from "react-icons/rx";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "flex place-items-center overflow-hidden rounded-[8px]",
      className
    )}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

type PaginationButtonProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationButton = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationButtonProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "",
      buttonVariants({
        variant: isActive ? "db_ghost" : "db_disabled",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationButton.displayName = "PaginationButton";
const PaginationFirstPage = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to first page"
    size="default"
    className={cn("gap-1 ", className)}
    {...props}
  >
    <RxDoubleArrowLeft className="w-4 h-4" />
    <span className="sr-only">First page</span>
  </PaginationButton>
);
PaginationFirstPage.displayName = "PaginationFirstPage";
const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => {
  return (
    <PaginationButton
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 ", className)}
      {...props}
    >
      <RxCaretLeft className="w-5 h-5" />
      <span className="sr-only">Previous</span>
    </PaginationButton>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationLastPage = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to last page"
    size="default"
    className={cn("gap-1 ", className)}
    {...props}
  >
    <span className="sr-only">Last page</span>
    <RxDoubleArrowRight className="w-4 h-4" />
  </PaginationButton>
);
PaginationLastPage.displayName = "PaginationLastPage";
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 ", className)}
    {...props}
  >
    <span className="sr-only">Next</span>
    <RxCaretRight className="w-5 h-5" />
  </PaginationButton>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <FiMoreHorizontal className="w-4 h-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
  PaginationFirstPage,
  PaginationLastPage,
};
