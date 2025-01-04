import { cn } from "@/lib/utils";

type TH3 = React.HTMLAttributes<HTMLHeadingElement> & {
  classNames?: string;
};

const H3 = ({ className, children }: TH3) => {
  return (
    <h1 className={cn("font-bold leading-[19.2px] text-[16px]", className)}>
      {children}
    </h1>
  );
};

export default H3;
