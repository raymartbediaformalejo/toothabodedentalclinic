import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { useEffect, useState } from "react";
import { MdPlayArrow } from "react-icons/md";

import { TIME_LIST, WEEKDAYS } from "@/lib/variables";
import { cn } from "@/lib/utils";
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
  const time = watch("time");
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
    const currentDay = new Date();
    setValue("date", currentDay + "");
  }, []);

  useEffect(() => {
    const requestDateAndTimeData = { date: requestedDate, time: requestedTime };
    props.onSaveRequestDateAndTimeData(requestDateAndTimeData);
  }, [requestedDate, requestedTime]);

  return (
    <div>
      <div className="container p-4 mx-auto border border-neutral-200 rounded-[8px]">
        <div className="flex justify-between w-full mb-4">
          <button onClick={handlePrevWeek} type="button">
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
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-sm text-center text-neutral-700">
              {day}
            </div>
          ))}

          {daysInWeek.map((day, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setValue("date", day + "")}
              className={cn(
                "border rounded-md p-2 text-center cursor-pointer",
                isSameDay(watch("date"), day)
                  ? "bg-primary-100  outline outline-2 outline-primary-600 text-primary-900"
                  : ""
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
          All time are in Asia/Manila (UTC+08)
        </p>
        <div className="grid grid-cols-4 gap-4 mt-3">
          {TIME_LIST.map(({ value, label }) => {
            // const isSelected =
            return (
              <button
                key={value}
                type="button"
                className={cn(
                  "rounded-[8px] px-3 py-2",
                  time === value
                    ? "bg-primary-100 outline outline-primary-600 outline-2 text-primary-900"
                    : "bg-neutral-200 text-neutral-800"
                )}
                onClick={() => setValue("time", value)}
              >
                <input
                  id={value}
                  onChange={() => setValue("time", value)}
                  type="radio"
                  value={value}
                  className="hidden"
                />
                <p className="text-center font-medium text-[13px] ">{label}</p>
              </button>
            );
          })}
        </div>
        {formState.errors.time && (
          <span className="text-sm text-destructive">
            {formState.errors.time.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default RequestDateAndTime;
