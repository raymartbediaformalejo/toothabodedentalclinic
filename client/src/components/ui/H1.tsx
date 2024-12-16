import { cn } from "@/lib/utils";

type TH1 = React.HTMLAttributes<HTMLHeadingElement> & {
  classNames?: string;
};

const H1 = ({ className, children }: TH1) => {
  return (
    <h1 className={cn("heading-1 font-bold leading-[52.8px]", className)}>
      {children}
    </h1>
  );
};

export default H1;
