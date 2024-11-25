import { TCreatePatient, TLoginUser } from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  createPatientAPI,
  loginUserAPI,
  logout,
  removeHeaderToken,
  setHeaderToken,
} from "./api";

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
