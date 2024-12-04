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
} from "./api";
import { TDentistId, TServiceId } from "@/types/types";

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
