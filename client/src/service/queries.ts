import { useQuery } from "@tanstack/react-query";

import {
  barangaysAPI,
  getServiceAPI,
  getAllServicesAPI,
  getUserAPI,
  provincesCitiesAPI,
  regionsAPI,
  getAllDentistAPI,
  getDentistAPI,
  getServicesByIdAPI,
  getAllMyAppointmentAPI,
  getMyAppointmentAPI,
  getAllAppointmentPatientInfoAPI,
  getAppointmentPatientInfoAPI,
  getAllMedicalHistoryAPI,
  getMedicalHistoryAPI,
  getUserAccountStatus,
  penaltyAPI,
  getAppointmentNoShowAPI,
  getDentistAppointmentAPI,
  getDentistPendingAppointmentAPI,
  getDentistReScheduleAppointmentAPI,
  getPatientAppointmentsAPI,
  getPatientsOfDoctor,
  getAllPatientAPI,
  getAllUsersAPI,
  getAllAppointmentsAPI,
  getAllPendingAppointmentAPI,
  getAllReschedAppointmentAPI,
} from "./api";
import { TDentistId, TServiceId, TServiceIds } from "@/types/types";

export const useGetAllRegions = () => {
  return useQuery({
    queryKey: ["/regions"],
    queryFn: regionsAPI,
  });
};

export const useGetProvincesCities = (id: string) => {
  return useQuery({
    queryKey: ["/regions/provinces-cities", id],
    queryFn: provincesCitiesAPI,
  });
};

export const useGetBarangays = (id: string) => {
  return useQuery({
    queryKey: ["/regions/brgys", id],
    queryFn: barangaysAPI,
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", "single", id], // Unique query key
    queryFn: getUserAPI, // Calls /user/single/:userId
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getAllUsersAPI,
  });
};

export const useGetAllPatients = () => {
  return useQuery({
    queryKey: ["patient"],
    queryFn: getAllPatientAPI,
  });
};

export const useGetUserAccountStatus = (id: string) => {
  return useQuery({
    queryKey: ["user", "account-status", id], // Unique query key
    queryFn: getUserAccountStatus, // Calls /user/:userId/account-status
  });
};
export const useGetPatientsOfDoctor = (id: string) => {
  return useQuery({
    queryKey: ["user", "patientsOfDoctor", id], // Unique query key
    queryFn: getPatientsOfDoctor, // Calls /user/:userId/account-status
  });
};

// ============ || SERVICE || ===========

export const useGetAllServices = () => {
  return useQuery({
    queryKey: ["service"],
    queryFn: getAllServicesAPI,
  });
};

export const useGetService = (serviceId: TServiceId) => {
  return useQuery({
    queryKey: ["service", serviceId],
    queryFn: getServiceAPI,
  });
};

export const useGetServicesById = (serviceIds: TServiceIds) => {
  return useQuery({
    queryKey: ["servicesById", serviceIds],
    queryFn: () => getServicesByIdAPI(serviceIds),
    enabled: !!serviceIds,
  });
};

// ============ || DENTIST || ===========

export const useGetAllDentist = () => {
  return useQuery({
    queryKey: ["dentist"],
    queryFn: getAllDentistAPI,
  });
};

export const useGetDentist = (dentistId: TDentistId) => {
  return useQuery({
    queryKey: ["dentist", dentistId],
    queryFn: getDentistAPI,
  });
};

// ============ || APPOINTMENT || ===========

export const useGetAllAppointments = () => {
  return useQuery({
    queryKey: ["appointment"],
    queryFn: getAllAppointmentsAPI,
  });
};
export const useGetAllRequestingReschedAppointments = () => {
  return useQuery({
    queryKey: ["appointment"],
    queryFn: getAllReschedAppointmentAPI,
  });
};
export const useGetMyAllAppointment = (userId: string) => {
  return useQuery({
    queryKey: ["appointment", userId],
    queryFn: () => getAllMyAppointmentAPI(userId),
  });
};

export const useGetMyAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getMyAppointmentAPI({ queryKey: [appointmentId] }),
  });
};

// ============ || APPOINTMENT PATIENT INFO || ===========

export const useGetAllAppointmentPatientInfo = () => {
  return useQuery({
    queryKey: ["appointment-patient-info"],
    queryFn: () => getAllAppointmentPatientInfoAPI(),
  });
};

export const useGetAppointmentPatientInfo = (id: string) => {
  return useQuery({
    queryKey: ["appointment-patient-info", id],
    queryFn: () => getAppointmentPatientInfoAPI({ queryKey: [id] }),
  });
};

// ============ || MEDICAL HISTORY || ===========

export const useGetAllMedicalHistory = () => {
  return useQuery({
    queryKey: ["medical-history"],
    queryFn: () => getAllMedicalHistoryAPI(),
  });
};

export const useGetMedicalHistory = (id: string) => {
  console.log("useGetAppointmentPatientInfo ID:", id);
  return useQuery({
    queryKey: ["medical-history", id],
    queryFn: () => getMedicalHistoryAPI({ queryKey: [id] }),
  });
};

export const useGetPenalty = () => {
  return useQuery({
    queryKey: ["penalty"],
    queryFn: penaltyAPI,
  });
};

export const useGetUserAppoitmentNoShowSchedule = (id: string) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: getAppointmentNoShowAPI,
  });
};

// ============ || DENTIST/APPOINTMENT || ===========

export const useGetDentistAppointments = (dentistId: string) => {
  return useQuery({
    queryKey: ["appointment", "dentist", dentistId],
    queryFn: () => getDentistAppointmentAPI(dentistId),
  });
};
export const useGetPatientAppointments = (patientId: string) => {
  return useQuery({
    queryKey: ["appointment", "patient", patientId],
    queryFn: () => getPatientAppointmentsAPI(patientId),
  });
};
export const useGetAllPendingAppointments = () => {
  return useQuery({
    queryKey: ["appointment"],
    queryFn: getAllPendingAppointmentAPI,
  });
};
export const useGetDentistPendingAppointments = (dentistId: string) => {
  return useQuery({
    queryKey: ["appointment", "dentistPending", dentistId],
    queryFn: () => getDentistPendingAppointmentAPI(dentistId),
  });
};
export const useGetDentistReScheduleAppointments = (dentistId: string) => {
  return useQuery({
    queryKey: ["appointment", "dentistRescheduled", dentistId],
    queryFn: () => getDentistReScheduleAppointmentAPI(dentistId),
  });
};
