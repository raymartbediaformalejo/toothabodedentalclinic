import axios from "axios";
// import createAuthRefreshInterceptor from "axios-auth-refresh";

import {
  TAppointment,
  TApproveAppointment,
  TCancelAppointment,
  TChangePassword,
  TCreateDentist,
  TCreatePatient,
  TCreatePaymentVerification,
  TCreateService,
  TDentistId,
  TDentistIds,
  TEditDentist,
  TEditPatient,
  TEditService,
  TEditUser,
  TLoginUser,
  TPatientId,
  TPatientIds,
  TPaymentVerificationId,
  TRejectAppointment,
  TRequestDateAndTimeWithId,
  TSaveSortedDentist,
  TSaveSortedService,
  TServiceId,
  TServiceIds,
  TUpdatePenaltyFee,
  TUserId,
  TUserIds,
  TVerifyEmail,
} from "@/types/types";
// import { refreshAuth } from "./refresh-auth";

// const baseUrl = "http://localhost:4000/api";
// const baseUrl = "/api";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

export const loginUserAPI = async (data: TLoginUser) =>
  await axiosInstance.post("/auth/signin", data);

export const logout = async () => await axiosInstance.post("/auth/logout");

export const setHeaderToken = (token: string) => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  delete axiosInstance.defaults.headers.common.Authorization;
};

// createAuthRefreshInterceptor(axiosInstance, refreshAuth, {
//   statusCodes: [401],
//   pauseInstanceWhileRefreshing: true,
// });

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

// ============ || USER || ===========

export const reactivateUserAPI = async (data: { id: string }) => {
  const result = await axiosInstance.patch(`/reactivate-user/${data.id}`);

  console.log("changePasswordAPI: ", changePasswordAPI);
  return result;
};

export const getUserAPI = async (args: { queryKey: string[] }) => {
  const userId = args.queryKey[2]; // Extract userId from updated queryKey
  const { data } = await axiosInstance.get(`/user/single/${userId}`);
  return data;
};

export const getAllUsersAPI = async () => {
  const { data } = await axiosInstance.get("/user");
  return data;
};

export const getAllPatientAPI = async () => {
  const { data } = await axiosInstance.get("/user/patients");
  return data;
};

export const getUserAccountStatus = async (args: { queryKey: string[] }) => {
  const userId = args.queryKey[2]; // Extract userId from updated queryKey
  const { data } = await axiosInstance.get(`/user/${userId}/account-status`);
  return data;
};
export const getPatientsOfDoctor = async (args: { queryKey: string[] }) => {
  const dentistId = args.queryKey[2]; // Extract userId from updated queryKey
  const { data } = await axiosInstance.get(`/user/${dentistId}/patients`);
  return data;
};

export const editUserAPI = async (data: TEditUser) => {
  const result = await axiosInstance.patch(`/user/${data.id}`, {
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    suffix: data.suffix,
    profilePicUrl: data.profilePicUrl,
    updatedBy: data.updatedBy,
  });

  return result;
};

export const verifyEmailAPI = async (data: TVerifyEmail) => {
  const { data: response } = await axiosInstance.post(
    "/user/verifyEmail",
    data
  );
  return response;
};

export const deleteUserAPI = async (id: TUserId) => {
  const { data } = await axiosInstance.patch(`/user/delete/${id}`);
  return data;
};

export const deleteAllUserAPI = async (data: TUserIds) => {
  const { data: result } = await axiosInstance.patch(`/user/delete/all`, {
    data,
  });
  return result;
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

export const getServicesByIdAPI = async (data: TServiceIds) => {
  const { data: response } = await axiosInstance.post(
    "/service/getByIds",
    data
  );
  return response;
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

export const changeUserPasswordAPI = async (data: TChangePassword) => {
  const result = await axiosInstance.patch(`/user/changepassword/${data.id}`, {
    oldPassword: data.password,
    newPassword: data.newPassword,
  });

  console.log("changePasswordAPI: ", changePasswordAPI);
  return result;
};

// ============ || APPOINTMENT || ===========

export const getAllApprovedAppointmentsPerDayAPI = async () => {
  const { data } = await axiosInstance.get("/approved-appointments");
  return data;
};

export const getAllMyAppointmentAPI = async (userId: string) => {
  const { data } = await axiosInstance.get("/appointment", {
    params: { userId },
  });
  return data;
};

export const getAllAppointmentsAPI = async () => {
  const { data } = await axiosInstance.get("/appointment");
  return data;
};

export const getMyAppointmentAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(`/appointment/${queryKey[0]}`);
  return data;
};

export const createAppointmentAPI = async (data: TAppointment) =>
  await axiosInstance.post("/appointment", data);

export const requestRescheduleAppointmentAPI = async (
  data: TRequestDateAndTimeWithId
) => {
  const result = await axiosInstance.patch(
    `/appointment/request-reschedule`,
    data
  );
  return result;
};

export const cancelAppointmentAPI = async (data: TCancelAppointment) => {
  const result = await axiosInstance.patch(`/appointment/cancel/${data.id}`);
  return result;
};

export const markAsCompletedAppointmentAPI = async (
  data: TApproveAppointment
) => {
  const result = await axiosInstance.patch(
    `/mark-as-completed-appointment`,
    data
  );
  return result;
};
export const markAsCanceledAppointmentAPI = async (
  data: TApproveAppointment
) => {
  const result = await axiosInstance.patch(
    `/mark-as-canceled-appointment`,
    data
  );
  return result;
};
export const markAsNoShowAppointmentAPI = async (data: TApproveAppointment) => {
  const result = await axiosInstance.patch(
    `/mark-as-no-show-appointment`,
    data
  );
  return result;
};

export const approveAppointmentAPI = async (data: TApproveAppointment) => {
  const result = await axiosInstance.patch(`/approve-appointment`, data);
  return result;
};

export const approveRequestReschedAppointmentAPI = async (
  data: TApproveAppointment
) => {
  const result = await axiosInstance.patch(`/approve-reschedule`, data);
  return result;
};

export const rejectRequestReschedAppointmentAPI = async (
  data: TApproveAppointment
) => {
  const result = await axiosInstance.patch(`/reject-reschedule`, data);
  return result;
};

export const rejectAppointmentAPI = async (data: TRejectAppointment) => {
  const result = await axiosInstance.patch(`/reject-appointment`, data);
  return result;
};

// ============ || APPOINTMENT PATIENT INFO || ===========
export const getAllAppointmentPatientInfoAPI = async () => {
  const { data } = await axiosInstance.get("/appointment-patient-info");
  return data;
};

export const getAppointmentPatientInfoAPI = async (args: {
  queryKey: string[];
}) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(
    `/appointment-patient-info/${queryKey[0]}`
  );
  return data;
};

export const editPatientAPI = async (data: TEditPatient) => {
  const result = await axiosInstance.patch(`/service/${data.id}`, {
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    updatedBy: data.updatedBy,
  });

  return result;
};

export const deletePatientAPI = async (id: TPatientId) => {
  const { data } = await axiosInstance.patch(
    `/appointment-patient-info/delete/${id}`
  );
  return data;
};

export const deleteAllPatientAPI = async (data: TPatientIds) => {
  console.log("deleteAllPatientAPI: ", data);
  const { data: result } = await axiosInstance.patch(
    `/appointment-patient-info/delete/all`,
    {
      data,
    }
  );
  return result;
};

// ============ || MEDICAL HISTORY || ===========

export const getAllMedicalHistoryAPI = async () => {
  const { data } = await axiosInstance.get("/medical-history");
  return data;
};

export const getMedicalHistoryAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  console.log("queryKey: ", queryKey);
  const { data } = await axiosInstance.get(`/medical-history/${queryKey[0]}`);
  return data;
};

export const editPenaltyFeeAPI = async (data: TUpdatePenaltyFee) => {
  const { data: result } = await axiosInstance.patch(`/penalty`, data);
  return result;
};

export const penaltyAPI = async () => {
  const { data } = await axiosInstance.get("/penalty");
  return data;
};

export const getAppointmentNoShowAPI = async (args: { queryKey: string[] }) => {
  const { queryKey } = args;
  console.log("queryKey: ", queryKey);
  const { data } = await axiosInstance.get(
    `/user/${queryKey[1]}/no-show-appointment`
  );
  return data;
};

// ============ || PAYMENT VERIFICATION || ===========
export const markAsVerifiedPaymentVerificationAPI = async (
  data: TPaymentVerificationId
) => {
  const result = await axiosInstance.patch(
    `/mark-verified-payment-verification/${data.id}`
  );
  return result;
};
export const markAsIncompletePaymentVerificationAPI = async (
  data: TPaymentVerificationId
) => {
  const result = await axiosInstance.patch(
    `/mark-incomplete-payment-verification/${data.id}`
  );
  return result;
};
export const markAsOverpaidPaymentVerificationAPI = async (
  data: TPaymentVerificationId
) => {
  const result = await axiosInstance.patch(
    `/mark-overpaid-payment-verification/${data.id}`
  );
  return result;
};

export const getAllPaymentVerificationAPI = async () => {
  const { data } = await axiosInstance.get("/payment-verification");
  return data;
};

export const getPaymentVerificationAPI = async (args: {
  queryKey: string[];
}) => {
  const { queryKey } = args;
  const { data } = await axiosInstance.get(
    `/payment-verification/${queryKey[0]}`
  );
  return data;
};

export const createPaymentVerificationAPI = async (
  data: TCreatePaymentVerification
) => await axiosInstance.post("/payment-verification", data);

// ============ || DENTIST/APPOINTMENT || ===========

export const getDentistAppointmentAPI = async (dentistId: string) => {
  const { data } = await axiosInstance.get(`/appointment/${dentistId}/dentist`);
  return data;
};

export const getPatientAppointmentsAPI = async (patient: string) => {
  const { data } = await axiosInstance.get(`/appointment/${patient}/patient`);
  return data;
};

export const getAllReschedAppointmentAPI = async () => {
  const { data } = await axiosInstance.get(`/request-re-schedule-appointment`);
  return data;
};
export const getAllPendingAppointmentAPI = async () => {
  const { data } = await axiosInstance.get(`/pending-appointment`);
  return data;
};

export const getDentistPendingAppointmentAPI = async (dentistId: string) => {
  const { data } = await axiosInstance.get(
    `/appointment/pending/${dentistId}/dentist`
  );
  return data;
};

export const getDentistReScheduleAppointmentAPI = async (dentistId: string) => {
  const { data } = await axiosInstance.get(
    `/appointment/re_schedule/${dentistId}/dentist`
  );
  return data;
};
