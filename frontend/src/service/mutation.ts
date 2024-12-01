import {
  TCreatePatient,
  TCreateService,
  TEditService,
  TLoginUser,
  TSaveSortedService,
  TServiceId,
  TServiceIds,
} from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  createPatientAPI,
  createServiceAPI,
  deleteAllServiceAPI,
  deleteServiceAPI,
  editServiceAPI,
  loginUserAPI,
  logout,
  removeHeaderToken,
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
      queryClient.invalidateQueries({ queryKey: ["/service"] });
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
      if (data?.data?.data.status === 409) {
        // @ts-ignore
        toast.error(data?.data?.data.message);
      }
      // @ts-ignore
      if (data?.data?.data.status === 201) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["/service"] });
      navigate("/dashboardadmin/service");
    },
    onSettled: (_, error) => {
      return error;
    },
  });
};

export const useSaveSortedService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TSaveSortedService[]) => saveSortedServiceAPI(data),
    onSuccess: (data, variables, context) => {
      console.log("data useSaveSortedService: ", data);
      console.log("variables useSaveSortedService: ", variables);
      console.log("context useSaveSortedService: ", context);
      // @ts-ignore
      if (data?.data?.data.status === 200) {
        // @ts-ignore
        toast.success(data?.data?.data?.message);
      }
      queryClient.invalidateQueries({ queryKey: ["/service"] });
    },
    onError: (_, error) => {
      console.log("error useSaveSortedService: ", error);
      if (error) {
        // @ts-ignore
        toast.error(error?.response?.data.message);
      }
      return error;
    },
    onSettled: (_, error) => {
      console.log("error useSaveSortedService: ", error);
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
      queryClient.invalidateQueries({ queryKey: ["/service"] });
      navigate("/dashboardadmin/service");
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
      queryClient.invalidateQueries({ queryKey: ["/service"] });
      navigate("/dashboardadmin/service");
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
