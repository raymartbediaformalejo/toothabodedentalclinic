import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import { TCreatePatient, TLoginUser } from "@/types/types";
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
