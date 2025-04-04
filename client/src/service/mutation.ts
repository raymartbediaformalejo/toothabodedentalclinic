import {
  TAppointment,
  TApproveAppointment,
  TCancelAppointment,
  TChangePassword,
  TCreatePaymentVerification,
  TDentistIds,
  TEditUser,
  TPatientId,
  TPatientIds,
  TPaymentVerificationId,
  TRejectAppointment,
  TRequestDateAndTimeWithId,
  TUpdatePenaltyFee,
  TUserId,
  TUserIds,
  TVerifyEmail,
} from "./../types/types";
import {
  TCreateDentist,
  TCreatePatient,
  TCreateService,
  TDentistId,
  TEditDentist,
  TEditService,
  TLoginUser,
  TSaveSortedDentist,
  TSaveSortedService,
  TServiceId,
  TServiceIds,
} from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  approveAppointmentAPI,
  approveRequestReschedAppointmentAPI,
  cancelAppointmentAPI,
  changePasswordAPI,
  changeUserPasswordAPI,
  createAppointmentAPI,
  createDentistAPI,
  createPatientAPI,
  createPaymentVerificationAPI,
  createServiceAPI,
  deleteAllDentistAPI,
  deleteAllPatientAPI,
  deleteAllServiceAPI,
  deleteAllUserAPI,
  deleteDentistAPI,
  deletePatientAPI,
  deleteServiceAPI,
  deleteUserAPI,
  editDentistAPI,
  editPenaltyFeeAPI,
  editServiceAPI,
  editUserAPI,
  loginUserAPI,
  logout,
  markAsCanceledAppointmentAPI,
  markAsCompletedAppointmentAPI,
  markAsIncompletePaymentVerificationAPI,
  markAsNoShowAppointmentAPI,
  markAsOverpaidPaymentVerificationAPI,
  markAsVerifiedPaymentVerificationAPI,
  reactivateUserAPI,
  rejectAppointmentAPI,
  rejectRequestReschedAppointmentAPI,
  removeHeaderToken,
  requestRescheduleAppointmentAPI,
  saveSortedDentistAPI,
  saveSortedServiceAPI,
  setHeaderToken,
  verifyEmailAPI,
} from "./api";
import { toast } from "sonner";

export const useCreatePatient = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: TCreatePatient) => createPatientAPI(data),
    onSuccess: () => {
      navigate("/verify-email");
      toast.success(
        "Successfully created an account. Please verify your email."
      );
    },
    onSettled: (_, error) => {
      console.log("Error Creation", error);
      return "error";
    },
  });
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: TLoginUser) => loginUserAPI(data),
    onSuccess: (response) => {
      const {
        data: { accessToken },
      } = response;
      if (accessToken) {
        toast.success("Successfully login.");
        setHeaderToken(accessToken);
        localStorage.setItem("tooth_abode_dental_clinic_token", accessToken);
        const token = localStorage.getItem("tooth_abode_dental_clinic_token");
        const decoded = jwtDecode(token!);
        // @ts-expect-error: Unreachable code error
        const { id, email, isVerified, accountStatus, roles } = decoded;
        console.log("useLoginUser decoded: ", decoded);
        if (roles.includes("Admin")) {
          navigate("/admin");
        } else if (roles[0] === "Dentist" && roles.length === 1) {
          navigate("/dentist");
        } else {
          navigate("/");
        }
      } else {
        console.error("No access token received from the server.");
      }
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
        console.log("useLoginUser error: ", error);
      }
      return error;
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      removeHeaderToken();
      localStorage.removeItem("tooth_abode_dental_clinic_token");
      toast.success("Successfully logged out.");
      navigate("/login");
    },
    onError: (error) => {
      console.log("💥 Logout failed", error);
    },
  });
};

// ============ || USER || ===========

export const useReactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string }) => reactivateUserAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.status === 200) {
        // @ts-ignore
        toast.success(data?.data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useLogout(); // Include the useLogout hook

  return useMutation({
    mutationFn: (data: TVerifyEmail) => verifyEmailAPI(data),
    onSuccess: (data) => {
      console.log("data: ", data);
      toast.success("Email successfully verified");

      const token = localStorage.getItem("tooth_abode_dental_clinic_token");
      const decoded = jwtDecode(token!);
      // @ts-expect-error: Unreachable code error
      const { id } = decoded;

      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Call logout mutation
      logout.mutate(undefined, {
        onSuccess: () => {
          console.log("User logged out after verification.");
          navigate("/login"); // Redirect to login after logout
        },
      });
    },
    onError: (_, error) => {
      console.log("error: ", error);
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useEditUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TEditUser) => editUserAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/my-account");
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useDeleteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TUserId) => deleteUserAPI(data),
    onSuccess: (data) => {
      console.log("data useDeleteService: ", data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/admin/users");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useDeleteAllUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TUserIds) => deleteAllUserAPI(data),
    onSuccess: (data) => {
      console.log("data useDeleteAllService: ", data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/admin/users");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useChangeUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TChangePassword) => changeUserPasswordAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.status === 200) {
        // @ts-ignore
        toast.success(data?.data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

// ============ || SERVICE || ===========

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TCreateService) => createServiceAPI(data),
    onSuccess: (data) => {
      console.log("data: ", data);
      if (data?.data?.data.status === 201) {
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
    onSettled: (_, error) => {
      console.log("error: ", error);
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useEditService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TEditService) => editServiceAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["service"] });
      navigate("/admin/services");
    },
    onSettled: (_, error) => {
      console.log("error useEditService: ", error);
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useSaveSortedService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TSaveSortedService[]) => saveSortedServiceAPI(data),
    onSuccess: () => {
      toast.success(`Successfully sorted the services`);
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
    onError: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useDeleteService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TServiceId) => deleteServiceAPI(data),
    onSuccess: (data) => {
      console.log("data useDeleteService: ", data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["service"] });
      navigate("/admin/services");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useDeleteAllService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TServiceIds) => deleteAllServiceAPI(data),
    onSuccess: (data) => {
      console.log("data useDeleteAllService: ", data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["service"] });
      navigate("/admin/services");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

// ============ || SERVICE || ===========

export const useCreateDentist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TCreateDentist) => createDentistAPI(data),
    onSuccess: (data) => {
      if (data?.data?.data.status === 201) {
        toast.success(data?.data?.data?.message);
        navigate("/admin/dentists");
        queryClient.invalidateQueries({ queryKey: ["dentist"] });
      }
    },
    onSettled: (_, error) => {
      console.log("error: ", error);
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useEditDentist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TEditDentist) => editDentistAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["dentist"] });
      navigate("/admin/dentists");
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useChangeDentistPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TChangePassword) => changePasswordAPI(data),
    onSuccess: (data) => {
      console.log("useChangeDentistPassword: ", data);
      // @ts-ignore
      if (data?.status === 200) {
        // @ts-ignore
        toast.success(data?.data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["dentist"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useSaveSortedDentist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TSaveSortedDentist[]) => saveSortedDentistAPI(data),
    onSuccess: () => {
      toast.success(`Successfully sorted the dentitst`);
      queryClient.invalidateQueries({ queryKey: ["dentist"] });
    },
    onError: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useDeleteDentist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TDentistId) => deleteDentistAPI(data),
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["dentist"] });
      navigate("/admin/dentists");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useDeleteAllDentist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TDentistIds) => deleteAllDentistAPI(data),
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["dentist"] });
      navigate("/admin/dentists");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

// ============ || APPOINTMENT || ===========

export const useCreateAppointment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TAppointment) => createAppointmentAPI(data),
    onSuccess: () => {
      toast.success("Successfully booked an appointment");

      queryClient.invalidateQueries({ queryKey: ["appointment"] });
      navigate("/");
    },
    onSettled: (_, error) => {
      console.log("error: ", error);
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

// ============ || PENALTY FEE || ===========
export const useEditPenaltyFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TUpdatePenaltyFee) => editPenaltyFeeAPI(data),
    onSuccess: () => {
      toast.success(`Successfully update penalty fee`);
      queryClient.invalidateQueries({ queryKey: ["penalty"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};

// ============ || PAYMENT VERIFICATION || ===========

export const useMarkAsVerifiedPaymentVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPaymentVerificationId) =>
      markAsVerifiedPaymentVerificationAPI(data),
    onSuccess: () => {
      toast.success(`Successfully verified the payment`);
      queryClient.invalidateQueries({ queryKey: ["payment-verification"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};
export const useMarkAsIncompletePaymentVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPaymentVerificationId) =>
      markAsIncompletePaymentVerificationAPI(data),
    onSuccess: () => {
      toast.success(`Successfully mark as "incomplete" payment`);
      queryClient.invalidateQueries({ queryKey: ["payment-verification"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};
export const useMarkAsOverpaidPaymentVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPaymentVerificationId) =>
      markAsOverpaidPaymentVerificationAPI(data),
    onSuccess: () => {
      toast.success(`Successfully mark as 'overpaid' the payment`);
      queryClient.invalidateQueries({ queryKey: ["payment-verification"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};

export const useCreatePaymentVerification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TCreatePaymentVerification) =>
      createPaymentVerificationAPI(data),
    onSuccess: (data) => {
      console.log("useCreatePaymentVerification: ", data);
      toast.success("Payment verification successfully sent to admin");
      queryClient.invalidateQueries({
        queryKey: ["payment-verification", "user"],
      });
      navigate("/");
    },
    onError: (_, error) => {
      console.log("error: ", error);
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useMarkAsCompletedAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TApproveAppointment) =>
      markAsCompletedAppointmentAPI(data),
    onSuccess: () => {
      toast.success(`Successfully mark as "completed" the appointment`);
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};
export const useMarkAsCanceledAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TApproveAppointment) =>
      markAsCanceledAppointmentAPI(data),
    onSuccess: () => {
      toast.success(`Successfully mark as "canceled" the appointment`);
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};
export const useMarkAsNoShowAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TApproveAppointment) => markAsNoShowAppointmentAPI(data),
    onSuccess: () => {
      toast.success(`Successfully mark as "no-show" the appointment`);
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (_, error) => {
      toast.error("Something went wrong.");
      return error;
    },
  });
};
export const useApproveAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TApproveAppointment) => approveAppointmentAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};
export const useApproveRequestReschedAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TApproveAppointment) =>
      approveRequestReschedAppointmentAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useRejectRequestReschedAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TApproveAppointment) =>
      rejectRequestReschedAppointmentAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

export const useRequestRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TRequestDateAndTimeWithId) =>
      requestRescheduleAppointmentAPI(data),
    onSuccess: (data) => {
      console.log("useRequestRescheduleAppointment success: ", data);
      toast.success("Reschedule request has been submitted successfully.");
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onSettled: (_, error) => {
      console.log("useRequestRescheduleAppointment error: ", error);
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};
export const useRejectAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TRejectAppointment) => rejectAppointmentAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};
export const useCancelAppointment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TCancelAppointment) => cancelAppointmentAPI(data),
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
      navigate("/my-appointment");
    },
    onSettled: (_, error) => {
      // @ts-ignore
      if (error) toast.error(error?.response?.data.message);
      return error;
    },
  });
};

// ============ || APPOINTMENT PATIENT INFO || ===========

export const useDeletePatient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPatientId) => deletePatientAPI(data),
    onSuccess: (data) => {
      console.log("data useDeletePatient: ", data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      navigate("/admin/patients");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};

export const useDeleteAllPatient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPatientIds) => deleteAllPatientAPI(data),
    onSuccess: (data) => {
      console.log("data useDeleteAllPatient: ", data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      navigate("/admin/patients");
    },
    onSettled: (_, error) => {
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
  });
};
