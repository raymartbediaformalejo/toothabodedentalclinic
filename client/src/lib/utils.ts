import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { TUsername } from "@/types/types";
import { MONTHS } from "./variables";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
