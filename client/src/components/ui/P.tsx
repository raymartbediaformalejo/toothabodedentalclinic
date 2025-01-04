import { cn } from "@/lib/utils";

type P = React.HTMLAttributes<HTMLParagraphElement> & {
  classNames?: string;
};

const P = ({ className, children }: P) => {
  return (
    <p className={cn("text-[14px] leading-[1.8]", className)}>{children}</p>
  );
};

export default P;
