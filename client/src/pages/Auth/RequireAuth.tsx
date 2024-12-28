import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type TRequireAuth = {
  allowedRoles: string[];
};

const RequireAuth = ({ allowedRoles }: TRequireAuth) => {
  const location = useLocation();
  const { roles, isVerified, accountStatus } = useAuth();

  if (!roles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (accountStatus === "no-show-restricted") {
    return (
      <Navigate to="/no-show-restricted" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default RequireAuth;
