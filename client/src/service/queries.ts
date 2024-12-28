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
    queryKey: ["user", id],
    queryFn: getUserAPI,
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

// Hook to fetch all appointments for a user
export const useGetMyAllAppointment = (userId: string) => {
  return useQuery({
    queryKey: ["appointment", userId], // unique queryKey for cache
    queryFn: () => getAllMyAppointmentAPI(userId), // API function to fetch appointments
  });
};

// Hook to fetch a specific appointment by appointmentId
export const useGetMyAppointment = ({
  userId,
  appointmentId,
}: {
  userId: string;
  appointmentId: string;
}) => {
  return useQuery({
    queryKey: ["appointment", userId, appointmentId], // unique queryKey for cache
    queryFn: () => getMyAppointmentAPI({ queryKey: [userId, appointmentId] }), // API function to fetch a specific appointment
  });
};
