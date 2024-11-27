import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { TUsername } from "@/types/types";

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
