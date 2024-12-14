import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import {
  TChangePassword,
  TCreateDentist,
  TCreatePatient,
  TCreateService,
  TDentistId,
  TDentistIds,
  TEditDentist,
  TEditService,
  TLoginUser,
  TSaveSortedDentist,
  TSaveSortedService,
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
  const result = await axiosInstance.patch(`/service/${data.id}`, {
    title: data.title,
    description: data.description,
    orderNo: data.orderNo,
    visible: data.visible,
    updatedBy: data.updatedBy,
  });

  return result;
};

export const saveSortedServiceAPI = async (data: TSaveSortedService[]) => {
  await axiosInstance.patch("/service/save/sortedService", data);
};

export const deleteServiceAPI = async (id: TServiceId) => {
  const { data } = await axiosInstance.patch(`/service/delete/${id}`);
  return data;
};

export const deleteAllServiceAPI = async (data: TServiceIds) => {
  const { data: result } = await axiosInstance.patch(`/service/delete/all`, {
    data,
  });
  return result;
};

// ============ || DENTIST || ===========

export const getAllDentistAPI = async () => {
  const { data } = await axiosInstance.get("/dentist");
  return data;
};

export const getDentistAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(`/dentist/${queryKey[1]}`);
  console.log("getDentistAPI: ", data);
  return data;
};

export const createDentistAPI = async (data: TCreateDentist) =>
  await axiosInstance.post("/dentist", data);

export const editDentistAPI = async (data: TEditDentist) => {
  const result = await axiosInstance.patch(`/dentist/${data.id}`, {
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    suffix: data.suffix,
    email: data.email,
    profilePicUrl: data.profilePicUrl,
    roleIds: data.roleIds,
    services: data.services,
    sunday: data.sunday,
    monday: data.monday,
    tuesday: data.tuesday,
    wednesday: data.wednesday,
    thursday: data.thursday,
    friday: data.friday,
    saturday: data.saturday,
    updatedBy: data.updatedBy,
  });

  return result;
};

export const saveSortedDentistAPI = async (data: TSaveSortedDentist[]) => {
  await axiosInstance.patch("/dentist/save/sortedDentist", data);
};

export const deleteDentistAPI = async (id: TDentistId) => {
  const { data } = await axiosInstance.patch(`/dentist/delete/${id}`);
  return data;
};

export const deleteAllDentistAPI = async (data: TDentistIds) => {
  const { data: result } = await axiosInstance.patch(`/dentist/delete/all`, {
    data,
  });
  return result;
};

export const changePasswordAPI = async (data: TChangePassword) => {
  const result = await axiosInstance.patch(
    `/dentist/changepassword/${data.id}`,
    {
      oldPassword: data.password,
      newPassword: data.newPassword,
    }
  );

  console.log("changePasswordAPI: ", changePasswordAPI);
  return result;
};
