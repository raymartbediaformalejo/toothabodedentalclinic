import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isSameWeek,
  isToday,
  isPast,
  startOfWeek,
  addWeeks,
  subWeeks,
  set,
} from "date-fns";
import { useEffect, useState } from "react";
import { MdPlayArrow } from "react-icons/md";

import { TIME_LIST } from "@/lib/variables";
import { cn, formatDate } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { TRequestDateAndTime } from "@/types/types";

type TRequestDateAndTimeProps = {
  onSaveRequestDateAndTimeData: (
    enteredDateAndTime: TRequestDateAndTime
  ) => void;
};

const RequestDateAndTime = (props: TRequestDateAndTimeProps) => {
  const { formState, watch, setValue } = useFormContext<TRequestDateAndTime>();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const firstDayOfWeek = startOfWeek(currentWeek);
  const lastDayOfWeek = endOfWeek(currentWeek);
  const today = new Date();

  const requestedDate = watch("date");
  const requestedTime = watch("time");

  const daysInWeek = eachDayOfInterval({
    start: firstDayOfWeek,
    end: lastDayOfWeek,
  });

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  useEffect(() => {
    const requestDateAndTimeData = { date: requestedDate, time: requestedTime };
    props.onSaveRequestDateAndTimeData(requestDateAndTimeData);
  }, [requestedDate, requestedTime]);

  const isDisabledDay = (day: Date) => {
    return isPast(day) && !isToday(day);
  };

  const isDisabledTime = (timeValue: string) => {
    if (!requestedDate) return false;

    const selectedDate = new Date(requestedDate);

    if (isToday(selectedDate)) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const selectedTime = set(today, { hours, minutes });
      return isPast(selectedTime);
    }

    return false;
  };

  const disablePrevWeek = isSameWeek(today, currentWeek);

  return (
    <div>
      <div className="container p-4 mx-auto border border-neutral-200 rounded-[8px]">
        <div className="flex justify-between w-full mb-4">
          <button
            onClick={handlePrevWeek}
            type="button"
            disabled={disablePrevWeek}
            className={cn(
              disablePrevWeek ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            <MdPlayArrow className="w-5 h-5 rotate-180 text-neutral-600" />
          </button>

          <h2 className="font-semibold text-center text-neutral-800">
            {format(lastDayOfWeek, "MMMM yyyy")}
          </h2>

          <button type="button" onClick={handleNextWeek}>
            <MdPlayArrow className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInWeek.map((day, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                const formattedDay = formatDate(day + "");
                console.log("formattedDay: ", formattedDay);
                setValue("date", formattedDay);
              }}
              disabled={isDisabledDay(day)}
              className={cn(
                "border rounded-md p-2 text-center cursor-pointer",
                isSameDay(watch("date"), day)
                  ? "bg-primary-100  outline outline-2 outline-primary-600 text-primary-900"
                  : "",
                isDisabledDay(day) ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {format(day, "d")}
            </button>
          ))}
          {formState.errors.date && (
            <span className="text-sm text-destructive">
              {formState.errors.date.message}
            </span>
          )}
        </div>
      </div>
      <div className="mt-10">
        <p className="text-neutral-500 text-[11px]">
          All times are in Asia/Manila (UTC+08)
        </p>
        <div className="grid grid-cols-4 gap-4 mt-3">
          {TIME_LIST.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("time", value)}
              disabled={isDisabledTime(value)}
              className={cn(
                "rounded-[8px] px-3 py-2",
                requestedTime === value
                  ? "bg-primary-100 outline outline-primary-600 outline-2 text-primary-900"
                  : "bg-neutral-200 text-neutral-800",
                isDisabledTime(value) ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <p className="text-center font-medium text-[13px]">{label}</p>
            </button>
          ))}
          {formState.errors.time && (
            <span className="text-sm text-destructive">
              {formState.errors.time.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDateAndTime;
