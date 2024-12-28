export const CITY_OF_MANILA_CODE = "City of Manila" as const;

export const DEFAULT_ROLE_ID = "92b73582-0dc5-4b3d-a17d-20523d7e0a82" as const;

export const ROW_PER_PAGE_OPTIONS = [
  "6",
  "10",
  "20",
  "30",
  "40",
  "50",
] as const;

export const TIME_LIST = [
  { value: "9:00", label: "9:00 AM" },
  { value: "9:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
] as const;

export const DENTIST_ROLE_ID = "241e4ec4-c535-4202-8e01-f53ac71372b6";

export const DEFAULT_USER_PROFILE_IMG_URL =
  "https://res.cloudinary.com/deklgilr5/image/upload/v1734542540/dentist_profiles/lmnod6hyqtlgzb6gfbej.png";

export const PEOPLE_PROFILE_IMG_URL =
  "https://res.cloudinary.com/deklgilr5/image/upload/v1734542641/dentist_profiles/pmwp8kbioxpd6d9lkdya.png";

export const ROLES = {
  Patient: "Patient",
  Dentist: "Dentist",
  Admin: "Admin",
};

export const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const FEMALE = "Female" as const;

export const RELATIONSHIP = [
  { value: "Parent", label: "Parent" },
  { value: "Spouse", label: "Spouse" },
  { value: "Child", label: "Child" },
  { value: "Guardian", label: "Guardian" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const ACCOUNT_STATUS = {
  PENDING_APPROVAL: "pending-approval",
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  NO_SHOW_RESTRICTED: "no-show-restricted",
};

export const APPOINTMENT_STATUS = {
  PENDING: { value: "pending", foreGround: "#C97E00" },
  APPROVED: { value: "approved", foreGround: "#14B8A6" },
  RE_SCHEDULED: { value: "re-scheduled", foreGround: "#0EA5E9" },
  NO_SHOW: { value: "no-show", foreGround: "#EF4444" },
  CANCELED: { value: "canceled", foreGround: "#737373" },
  COMPLETE: { value: "complete", foreGround: "#6366F1" },
} as const;
