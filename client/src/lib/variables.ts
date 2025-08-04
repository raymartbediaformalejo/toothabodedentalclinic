export const CITY_OF_MANILA_CODE = "City of Manila" as const;

export const DEFAULT_ROLE_ID = "0b998ea6-5c2d-4e16-b79c-cabcb6486dc0" as const;

export const TOOTH_ABODE_FB_URL =
  "https://www.facebook.com/profile.php?id=100064125608150";

export const ROW_PER_PAGE_OPTIONS = [
  "6",
  "10",
  "20",
  "30",
  "40",
  "50",
] as const;

export const TIME_LIST = [
  { value: "N/A", label: "N/A" },
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
  { value: "17:00", label: "5:00 PM" },
] as const;

export const TIME_BUTTON_LIST = [
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
  ACTIVE: {
    value: "active",
    label: "Active",
    foreground: "#064E3B",
    background: "#ECFDF5",
    message: "Your account is active and in good standing.",
  },
  INACTIVE: {
    value: "inactive",
    label: "Inactive",
    foreground: "#525252",
    background: "#E5E5E5",
    message:
      "Your account is currently inactive. Please contact support if this is unexpected.",
  },
  SUSPENDED: {
    value: "suspended",
    label: "Suspended",
    foreground: "#896022",
    background: "#FFECCF",
    message:
      "Your account has been suspended. Please resolve the issue to regain access.",
  },
  NO_SHOW_RESTRICTED: {
    value: "no_show_restricted",
    label: "Penalized",
    foreground: "#9F1239",
    background: "#FEE2E2",
    message:
      "Your account is restricted due to no-show appointment. Please contact the clinic for resolution.",
  },
  PAYMENT_VERIFICATION: {
    value: "payment_verification",
    label: "Payment Verification",
    foreground: "#0C4A6E",
    background: "#F0F9FF",
    message:
      "Your account is awaiting payment verification. Please settle your payment to continue using the services.",
  },
} as const;

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
    value: "completed",
    label: "Complete",
    foreGround: "#6366F1",
    backGround: "#EEF2FF",
    message:
      "Your appointment has been completed. Thank you for choosing Tooth Abode Dental Clinic!",
  },
  REJECT: {
    title: "Rejected Appointment!",
    value: "rejected",
    label: "Rejected",
    foreGround: "#9F1239",
    backGround: "#FEE2E2",
    message: "Your appointment has been rejected.",
  },
  REQUESTING_RE_SCHEDULE: {
    title: "Reschedule Request Submitted!",
    value: "requesting_re_schedule",
    label: "Requesting re-schedule",
    foreGround: "#06B6D4",
    backGround: "#ECFEFF",
    message:
      "You have requested to reschedule your appointment. The Tooth Abode Dental Clinic team is reviewing your request.",
  },
  REJECT_REQUEST_RE_SCHEDULE: {
    title: "Reschedule Request Rejected!",
    value: "rejected_request_re_sched",
    label: "Rejected Reschedule",
    foreGround: "#CA3401",
    backGround: "#FFEDD4",
    message:
      "Your request to reschedule the appointment has been rejected. Please contact the clinic for further assistance.",
  },
} as const;

export const PAYMENT_VERIFICATION_STATUS = {
  PENDING_PAYMENT_VERIFICATION: {
    title: "Payment Verification in Progress!",
    value: "pending_payment_verification",
    label: "Pending Verification",
    foreGround: "#C97E00",
    backGround: "#FFF9F0",
    message:
      "Your payment is currently being verified. Please wait for confirmation. This process may take a few minutes.",
  },
  PAYMENT_VERIFIED: {
    title: "Payment Verified!",
    value: "payment_verified",
    label: "Payment Verified",
    foreGround: "#6366F1",
    backGround: "#EEF2FF",
    message: "Your payment has been successfully verified. Thank you!",
  },
  PAYMENT_INCOMPLETE: {
    title: "Insufficient Payment!",
    value: "payment_incomplete",
    label: "Payment Incomplete",
    foreGround: "#D97706",
    backGround: "#FEF3C7",
    message:
      "Your payment is insufficient. Please settle the remaining balance to complete your payment.",
  },
  PAYMENT_OVERPAID: {
    title: "Overpayment Received!",
    value: "payment_overpaid",
    label: "Overpaid",
    foreGround: "#059669",
    backGround: "#D1FAE5",
    message:
      "You have paid more than the required amount. Please contact support for a refund or credit adjustment.",
  },
} as const;
