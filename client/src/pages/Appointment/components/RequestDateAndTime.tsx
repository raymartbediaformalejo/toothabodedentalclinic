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
  getDay,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { MdPlayArrow } from "react-icons/md";

import { TIME_BUTTON_LIST } from "@/lib/variables";
import { cn, formatDate } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import {
  TApprovedAppointmentsPerDay,
  TDentist,
  TRequestDateAndTime,
} from "@/types/types";
import {
  useGetAllApprovedAppointmentPerDay,
  useGetDentist,
} from "@/service/queries";
import { useSearchParams } from "react-router-dom";

type TRequestDateAndTimeProps = {
  onSaveRequestDateAndTimeData: (
    enteredDateAndTime: TRequestDateAndTime
  ) => void;
};

const RequestDateAndTime = (props: TRequestDateAndTimeProps) => {
  const [searchParams] = useSearchParams();
  const dentistParam = searchParams.get("dentist");
  const dentistId = JSON.parse(decodeURIComponent(dentistParam as string));

  const { data: dentistData } = useGetDentist(dentistId!);
  const dentist: TDentist | undefined = dentistData?.data;

  console.log("DENTIST ID: ", dentistId);
  console.log("DENTIST: ", dentist);
  const { data: approvedAppointmentsData } =
    useGetAllApprovedAppointmentPerDay();

  const allApprovedAppointments: TApprovedAppointmentsPerDay[] = useMemo(
    () => approvedAppointmentsData?.data || [],
    [approvedAppointmentsData]
  );
  console.log("allApprovedAppointments: ", allApprovedAppointments);
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

  const isDisabledTime = (timeValue: string) => {
    if (!requestedDate) return false;

    const selectedDate = new Date(requestedDate);
    const appointmentForDay = allApprovedAppointments.find(
      (appointment) =>
        appointment.year === format(selectedDate, "yyyy") &&
        appointment.month === format(selectedDate, "MMMM") &&
        appointment.day === format(selectedDate, "d")
    );

    if (!appointmentForDay) return false;

    const [selectedHours, selectedMinutes] = timeValue.split(":").map(Number);
    const selectedTime = set(today, {
      hours: selectedHours,
      minutes: selectedMinutes,
    });

    const serviceDuration = 60 * 60 * 1000;
    const selectedEndTime = new Date(selectedTime.getTime() + serviceDuration);

    for (const bookedSlot of appointmentForDay.bookedTime) {
      if (
        typeof bookedSlot !== "object" ||
        !bookedSlot.startTime ||
        !bookedSlot.endTime
      ) {
        continue; // Skip invalid entries
      }

      const { startTime, endTime } = bookedSlot;
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      const bookedStartTime = set(today, {
        hours: startHours,
        minutes: startMinutes,
      });
      const bookedEndTime = set(today, {
        hours: endHours,
        minutes: endMinutes,
      });

      if (
        (selectedTime >= bookedStartTime && selectedTime < bookedEndTime) ||
        (selectedEndTime > bookedStartTime &&
          selectedEndTime <= bookedEndTime) ||
        (selectedTime <= bookedStartTime && selectedEndTime >= bookedEndTime)
      ) {
        return true;
      }
    }

    if (isToday(selectedDate) && isPast(selectedTime)) {
      return true;
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
          {daysInWeek.map((day, index) => {
            const formattedDay = formatDate(day + "");
            const weekDayIndex = getDay(day);
            const weekDayNames = [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ] as const;

            const weekDayName = weekDayNames[weekDayIndex] as keyof TDentist;
            const scheduleForDay = Array.isArray(dentist?.[weekDayName])
              ? dentist?.[weekDayName].filter(
                  (schedule) =>
                    typeof schedule === "object" && schedule !== null
                )
              : [];

            const isDentistUnavailable =
              Array.isArray(scheduleForDay) &&
              scheduleForDay.some(
                (schedule) =>
                  schedule.startTime === "N/A" && schedule.endTime === "N/A"
              );

            const appointmentForDay = allApprovedAppointments.find(
              (appointment) =>
                appointment.year === format(day, "yyyy") &&
                appointment.month === format(day, "MMMM") &&
                appointment.day === format(day, "d")
            ) || { availableSlot: 8 };

            const isSlotZero = appointmentForDay.availableSlot === 0;
            const isBeforeToday = isPast(day) && !isToday(day);
            const isDisabled =
              isBeforeToday || isSlotZero || isDentistUnavailable;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  console.log("formattedDay: ", formattedDay);
                  setValue("date", formattedDay);
                  setValue("time", "");
                }}
                disabled={isDisabled}
                className={cn(
                  "border rounded-md p-2 text-center cursor-pointer",
                  isSameDay(watch("date"), day)
                    ? "bg-primary-100 outline outline-2 outline-primary-600 text-primary-900"
                    : "",
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                <div>{format(day, "d")}</div>
                <div className="text-[10px] text-center text-neutral-500 mt-1">
                  {isBeforeToday || isDentistUnavailable
                    ? "--"
                    : isSlotZero
                    ? "Fully Booked"
                    : `Slots: ${appointmentForDay.availableSlot}`}
                </div>
              </button>
            );
          })}

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
          {TIME_BUTTON_LIST.map(({ value, label }) => (
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
