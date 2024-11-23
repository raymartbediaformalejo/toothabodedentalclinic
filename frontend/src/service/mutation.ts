import { TCreatePatient } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPatientAPI } from "./api";

export const useCreatePatient = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: TCreatePatient) => createPatientAPI(data),
    onSuccess: () => {
      navigate("/");
    },
    onSettled: (_, error) => {
      console.log("Error Creation", error);
      return "error";
    },
  });
};
