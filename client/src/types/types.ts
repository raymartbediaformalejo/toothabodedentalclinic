import { z } from "zod";
import {
  appointmentInfoSchema,
  changePasswordSchema,
  createDentistSchema,
  createPatientSchema,
  createServiceSchema,
  dentistSchema,
  editDentistSchema,
  editServiceSchema,
  editUserSchema,
  loginUserSchema,
  medicalHistorySchema,
  patientInfoSchema,
  patientInfoWithIdSchema,
  paymentVerificationSchema,
  penaltySchema,
  requestDateTimeSchema,
  requestDateTimeWithIdSchema,
  saveSortedDentistSchema,
  saveSortedServiceSchema,
  serviceSchema,
  updatePenaltyFeeSchema,
  userSchema,
  userWithRoleSchema,
  verifyEmailSchema,
} from "./schema";

export type TCreatePatient = z.infer<typeof createPatientSchema>;

export type TLoginUser = z.infer<typeof loginUserSchema>;

export type TRegion = {
  code: string;
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
};

export type TProvince = TRegion & { region_id: number };

export type TBrgys = TProvince & {
  city_municipality_id: number;
  province_id: number;
  status: string;
};
export type TBrgysManila = {
  name: string;
};

export type TUsername = {
  firstname: string;
  lastname: string;
  middlename?: string;
};

// ============ || USER || ===========

export type TUser = z.infer<typeof userSchema>;
export type TUserWithRole = z.infer<typeof userWithRoleSchema>;
export type TEditUser = z.infer<typeof editUserSchema>;
export type TUserId = string;
export type TUserIds = { ids: TUserId[] };
export type TVerifyEmail = z.infer<typeof verifyEmailSchema>;
export type TUserAccountStatus = {
  isVerified: boolean;
  accountStatus: string;
};
export type TChangePassword = z.infer<typeof changePasswordSchema>;

// ============ || SERVICE || ===========

export type TService = z.infer<typeof serviceSchema>;
export type TCreateService = z.infer<typeof createServiceSchema>;
export type TEditService = z.infer<typeof editServiceSchema>;
export type TSaveSortedService = z.infer<typeof saveSortedServiceSchema>;
export type TServiceId = string;
export type TServiceIds = { ids: TServiceId[] };

// ============ || DENTIST || ===========

export type TDentist = z.infer<typeof dentistSchema>;
export type TCreateDentist = z.infer<typeof createDentistSchema>;
export type TEditDentist = z.infer<typeof editDentistSchema>;
export type TSaveSortedDentist = z.infer<typeof saveSortedDentistSchema>;
export type TDentistId = string;
export type TDentistIds = { ids: TDentistId[] };
export type TAvailability = [{}];

// ============ || APPOINTMENT || ===========

export type TAppointmentInfo = z.infer<typeof appointmentInfoSchema>;
export type TPatientInfo = z.infer<typeof patientInfoSchema>;

export type TRequestDateAndTime = z.infer<typeof requestDateTimeSchema>;
export type TRequestDateAndTimeWithId = z.infer<
  typeof requestDateTimeWithIdSchema
>;
export type TMedicalHistory = z.infer<typeof medicalHistorySchema>;
export type TAppointment = TAppointmentInfo &
  TRequestDateAndTime &
  TPatientInfo &
  TMedicalHistory & { id: string };

export type TMyAppointment = {
  id: string;
  dentistId: string;
  appointmentPatientInfoId: string;
  medicalHistoryId: string;
  dentistFirstName: string;
  dentistLastName: string;
  dentistMiddleName: string;
  dentistSuffix: string;
  patientId: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  patientSuffix: string;
  schedule: string;
  status: string;
  requestedReschedule: string;
  limitReschedule: number;
  isPenaltyPaid: string;
  services: string[];
  createdAt: string;
  createdBy: string;
};

export type TMyAppointmentWithResched = TMyAppointment & {
  requestedResched: string;
};

export type TMyAppointmentId = string;

export type TPenalty = z.infer<typeof penaltySchema>;

export type TUpdatePenaltyFee = z.infer<typeof updatePenaltyFeeSchema>;

export type TPaymentVerification = z.infer<typeof paymentVerificationSchema>;

export type TPaymentVerificationId = {
  id: string;
};

export type TUserNoShowSchedule = {
  appointments: {
    id: string;
    schedule: string;
  }[];
};

export type TCancelAppointment = {
  id: string;
};

export type TApproveAppointment = {
  appointmentId: string;
};
export type TRejectAppointment = {
  appointmentId: string;
};

// ============ || APPOINTMENT PATIENT INFO || ===========

export type TPatientInfoWithId = z.infer<typeof patientInfoWithIdSchema>;
export type TEditPatient = z.infer<typeof patientInfoWithIdSchema>;
export type TPatientId = string;
export type TPatientIds = { ids: TPatientId[] };
