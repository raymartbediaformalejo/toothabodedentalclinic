import { TChangePassword, TDentistIds } from "./../types/types";
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
  changePasswordAPI,
  createDentistAPI,
  createPatientAPI,
  createServiceAPI,
  deleteAllDentistAPI,
  deleteAllServiceAPI,
  deleteDentistAPI,
  deleteServiceAPI,
  editDentistAPI,
  editServiceAPI,
  loginUserAPI,
  logout,
  removeHeaderToken,
  saveSortedDentistAPI,
  saveSortedServiceAPI,
  setHeaderToken,
} from "./api";
import { toast } from "sonner";

export const useCreatePatient = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: TCreatePatient) => createPatientAPI(data),
    onSuccess: () => {
      navigate("/log-in");
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
        setHeaderToken(accessToken);
        localStorage.setItem("jwt", accessToken);
        const token = localStorage.getItem("jwt");
        const decoded = jwtDecode(token!);
        // @ts-expect-error: Unreachable code error
        const { email, roles } = decoded.UserInfo;
        if (roles.includes("Admin")) {
          navigate("/dashboardadmin");
        } else if (roles.includes("Dentist")) {
          navigate("/dashboarddentist");
        } else {
          navigate("/");
        }
      } else {
        console.error("No access token received from the server.");
      }
    },
    onError: (_, error) => {
      console.log("Error Creation", error);
      return "error";
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      removeHeaderToken();
      localStorage.removeItem("jwt");
    },
    onError: (error) => {
      console.log("💥 Logout failed", error);
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
      navigate("/services");
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
      navigate("/services");
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
      navigate("/services");
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
        navigate("/dentists");
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
      navigate("/dentists");
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
      navigate("/dentists");
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
      navigate("/dentists");
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
