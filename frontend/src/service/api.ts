import { TCreatePatient } from "@/types/types";
import axios from "axios";

const baseUrl = "http://localhost:4000/api";
// const baseUrl = "/api";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
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
