import { useQuery } from "@tanstack/react-query";

import {
  barangaysAPI,
  getServiceAPI,
  getAllServicesAPI,
  getUserAPI,
  provincesCitiesAPI,
  regionsAPI,
} from "./api";
import { TServiceId } from "@/types/types";

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
  console.log("id: ", id);
  return useQuery({
    queryKey: ["/user", id],
    queryFn: getUserAPI,
  });
};

export const useGetAllServices = () => {
  return useQuery({
    queryKey: ["/service"],
    queryFn: getAllServicesAPI,
  });
};

export const useGetService = (serviceId: TServiceId) => {
  return useQuery({
    queryKey: ["/service", serviceId],
    queryFn: getServiceAPI,
  });
};
