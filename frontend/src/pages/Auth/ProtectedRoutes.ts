import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "@/service/api";

const ProtectedRoutes = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get("/auth/verify");
      } catch (error) {
        if (error) return navigate("/sign-in", { replace: true });
      }
    };
    fetchData();
  }, [navigate]);
  return children;
};

export default ProtectedRoutes;
