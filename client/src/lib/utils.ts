import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { TUsername } from "@/types/types";
import { MONTHS } from "./variables";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isScheduleInPast = (schedule: string): boolean => {
  const currentDate = new Date();
  const appointmentDate = new Date(schedule);

  return appointmentDate < currentDate;
};

export const canRequestReschedule = (schedule: string): boolean => {
  if (!schedule) return false; // Ensure the schedule exists

  const now = new Date(); // Current date and time
  const appointmentDate = new Date(schedule); // Parse the schedule into a Date object

  if (isNaN(appointmentDate.getTime())) {
    console.error("Invalid date format");
    return false; // Handle invalid date formats
  }

  // Calculate the difference in milliseconds
  const timeDifference = appointmentDate.getTime() - now.getTime();

  // Convert the time difference into hours
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  // Check if the appointment is at least 24 hours away
  return hoursDifference >= 24;
};

export const createUsername = (user: TUsername): string => {
  const { firstname = "", lastname = "", middlename = "" } = user;
  const formattedFirstName =
    firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
  const formattedLastName =
    lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();

  if (middlename) {
    const formattedMiddleInitial = middlename.charAt(0).toUpperCase();
    return `${formattedFirstName} ${formattedMiddleInitial}. ${formattedLastName}`;
  } else {
    return `${formattedFirstName} ${formattedLastName}`;
  }
};

export const formatDate = (rawDateString: string) => {
  const date = new Date(rawDateString);

  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const formatTimeTo12Hour = (time: string) => {
  const [hour, _] = time.split(":").map(Number);

  const period = hour >= 12 ? "PM" : "AM";

  const hour12 = hour % 12 || 12;

  return `${hour12} ${period}`;
};

export const formatDateTo12Hour = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${day}, ${year} / ${hours}:${formattedMinutes}${period}`;
};

export const formatReadableDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const datePart = date.toLocaleDateString("en-US", options);

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} - ${timePart}`;
};

export const formatAppointmentDate = (dateString: string) => {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Return a fallback string if the date is invalid
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days[date.getDay()]; // Day of the week
  const dayOfMonth = date.getDate(); // Day of the month
  const month = months[date.getMonth()]; // Month
  const year = date.getFullYear(); // Year

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  // Combine into desired format
  return `${formattedHours}:${minutes} ${period} ${day}, ${dayOfMonth} ${month} ${year}`;
};
