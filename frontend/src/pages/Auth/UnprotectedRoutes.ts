import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "@/service/api";

const UnprotectedRoutes = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get("/auth/verify");
        // navigate("/signup", { replace: true });
      } catch (error) {
        console.log(error);
        if (error) return false;
      }
    };
    fetchData();
  }, [navigate]);
  return children;
};

export default UnprotectedRoutes;
