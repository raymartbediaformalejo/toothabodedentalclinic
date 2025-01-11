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
  NO_SHOW_RESTRICTED: "no_show_restricted",
  PAYMENT_VERIFICATION: "payment_verification",
};

export const APPOINTMENT_STATUS = {
  PENDING: {
    title: "Requested Appointment!",
    value: "pending",
    label: "Pending",
    foreGround: "#C97E00",
    backGround: "#FFF9F0",
    message:
      "Your appointment is currently being evaluated by the Tooth Abode Dental Clinic team. Please wait for further updates.",
  },
  APPROVED: {
    title: "Approved Appointment!",
    value: "approved",
    label: "Approved",
    foreGround: "#1D6E3E",
    backGround: "#D7F7E7",
    message:
      "Your appointment has been approved! We look forward to seeing you at the scheduled time.",
  },
  RE_SCHEDULED: {
    title: "Rescheduled Appointment!",
    value: "re_scheduled",
    label: "Re-scheduled",
    foreGround: "#0EA5E9",
    backGround: "#F0F9FF",
    message:
      "Your appointment has been rescheduled. Please check the updated schedule for the new time.",
  },
  NO_SHOW: {
    title: "Missed Appointment!",
    value: "no_show",
    label: "No-show",
    foreGround: "#EF4444",
    backGround: "#FEF2F2",
    message:
      "You missed your appointment. Please contact the clinic to reschedule or for further assistance.",
  },
  CANCELED: {
    title: "Canceled Appointment!",
    value: "canceled",
    label: "Canceled",
    foreGround: "#737373",
    backGround: "#F5F5F5",
    message:
      "Your appointment has been canceled. Please contact the clinic if this was unexpected.",
  },
  COMPLETE: {
    title: "Completed Appointment!",
    value: "complete",
    label: "Complete",
    foreGround: "#6366F1",
    backGround: "#EEF2FF",
    message:
      "Your appointment has been completed. Thank you for choosing Tooth Abode Dental Clinic!",
  },
  REJECT: {
    title: "Rejected Appointment!",
    value: "reject",
    label: "Reject",
    foreGround: "#9F1239",
    backGround: "#FEE2E2",
    message: "Your appointment has been rejected.",
  },
} as const;
