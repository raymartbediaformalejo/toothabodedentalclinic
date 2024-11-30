import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import {
  TCreatePatient,
  TCreateService,
  TEditService,
  TLoginUser,
  TServiceId,
  TServiceIds,
} from "@/types/types";
import { refreshAuth } from "./refresh-auth";

// const baseUrl = "http://localhost:4000/api";
// const baseUrl = "/api";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

export const loginUserAPI = async (data: TLoginUser) =>
  await axiosInstance.post("/auth", data);

export const logout = async () => await axiosInstance.post("/auth/logout");

export const setHeaderToken = (token: string) => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  delete axiosInstance.defaults.headers.common.Authorization;
};

createAuthRefreshInterceptor(axiosInstance, refreshAuth, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

export const regionsAPI = async () => {
  const { data } = await axiosInstance.get("/regions");
  return data;
};

export const provincesCitiesAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(
    `/regions/provinces-cities/${queryKey[1]}`
  );
  return data;
};

export const barangaysAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(`/regions/brgys/${queryKey[1]}`);
  return data;
};

export const createPatientAPI = async (data: TCreatePatient) => {
  console.log("createPatientAPI: ", data);
  await axiosInstance.post("/user/signup", data);
};

export const getUserAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(`/user/${queryKey[1]}`);
  return data;
};

// ============ || SERVICE || ===========

export const getAllServicesAPI = async () => {
  const { data } = await axiosInstance.get("/service");
  return data;
};

export const getServiceAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(`/service/${queryKey[1]}`);
  return data;
};

export const createServiceAPI = async (data: TCreateService) =>
  await axiosInstance.post("/service", data);

export const editServiceAPI = async (data: TEditService) => {
  await axiosInstance.patch(`/service/${data.id}`, {
    title: data.title,
    description: data.description,
    orderNo: data.orderNo,
    visible: data.visible,
    updatedBy: data.updatedBy,
  });
};

export const deleteServiceAPI = async (id: TServiceId) => {
  const { data } = await axiosInstance.patch(`/service/delete/${id}`);
  return data;
};

export const deleteAllServiceAPI = async (data: TServiceIds) => {
  const { data: result } = await axiosInstance.delete(`/service/deleteAll`, {
    data,
  });
  return result;
};
