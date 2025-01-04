const ACCOUNT_STATUS = {
  PENDING_APPROVAL: "pending-approval",
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  NO_SHOW_RESTRICTED: "no-show-restricted",
};

const APPOINTMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  RE_SCHEDULED: "re_scheduled",
  NO_SHOW: "no_show",
  CANCELED: "canceled",
  COMPLETE: "complete",
};

module.exports = { ACCOUNT_STATUS, APPOINTMENT_STATUS };
