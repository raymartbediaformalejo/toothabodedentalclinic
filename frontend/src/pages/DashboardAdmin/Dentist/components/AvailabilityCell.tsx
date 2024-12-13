import { cn } from "@/lib/utils";

type TAvailability = {
  dayOfWeek: string;
  availability?: { startTime: string; endTime: string }[];
};

const AvailabilityCell = ({ dayOfWeek, availability }: TAvailability) => {
  const firstLetter = dayOfWeek[0];
  const startTime = availability && availability[0]?.startTime;
  const endTime = availability && availability[0]?.endTime;
  const isHaveValue = !!startTime && !!endTime;

  return (
    <div
      className={cn(
        "rounded-full p-2 h-6 w-6 flex justify-center items-center ",
        isHaveValue
          ? "bg-primary-600  text-white"
          : "bg-neutral-200 text-neutral-600"
      )}
    >
      <p className="text-xs uppercase">{firstLetter}</p>
    </div>
  );
};

export default AvailabilityCell;
