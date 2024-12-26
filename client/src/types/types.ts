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
  loginUserSchema,
  medicalHistorySchema,
  patientInfoSchema,
  requestDateTimeSchema,
  saveSortedDentistSchema,
  saveSortedServiceSchema,
  serviceSchema,
  userSchema,
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

export type TUser = z.infer<typeof userSchema>;
export type TVerifyEmail = z.infer<typeof verifyEmailSchema>;

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
export type TChangePassword = z.infer<typeof changePasswordSchema>;

// ============ || APPOINTMENT || ===========

export type TAppointmentInfo = z.infer<typeof appointmentInfoSchema>;
export type TPatientInfo = z.infer<typeof patientInfoSchema>;
export type TRequestDateAndTime = z.infer<typeof requestDateTimeSchema>;
export type TMedicalHistory = z.infer<typeof medicalHistorySchema>;
