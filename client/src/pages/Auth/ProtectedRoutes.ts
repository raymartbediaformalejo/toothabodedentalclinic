import { PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "@/service/api";

const ProtectedRoutes = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get("/auth/verify");
        setIsVerified(true);
      } catch (error) {
        console.error("Authorization failed:", error);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [navigate]);

  return isVerified ? children : null;
};

export default ProtectedRoutes;
