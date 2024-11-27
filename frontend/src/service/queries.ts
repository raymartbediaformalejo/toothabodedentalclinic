import { useQuery } from "@tanstack/react-query";

import {
  barangaysAPI,
  getServicesAPI,
  getUserAPI,
  provincesCitiesAPI,
  regionsAPI,
} from "./api";

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

export const useGetServices = () => {
  return useQuery({
    queryKey: ["/service"],
    queryFn: getServicesAPI,
  });
};
