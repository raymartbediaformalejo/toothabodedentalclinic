import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useGetUserAccountStatus } from "@/service/queries";
import { TUserAccountStatus } from "@/types/types";
import { ACCOUNT_STATUS } from "@/lib/variables";

const AccountStatusAuth = () => {
  const location = useLocation();
  const { userId } = useAuth();
  const { data, isLoading } = useGetUserAccountStatus(userId);
  console.log("data: ", data);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const userAccountStatus: TUserAccountStatus = data || {
    isVerified: false,
    accountStatus: "unknown",
  };

  console.log("userAccountStatus: ", userAccountStatus);
  if (!userAccountStatus.isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (userAccountStatus.accountStatus === ACCOUNT_STATUS.NO_SHOW_RESTRICTED) {
    return (
      <Navigate to="/no-show-restricted" state={{ from: location }} replace />
    );
  }
  if (userAccountStatus.accountStatus === ACCOUNT_STATUS.PAYMENT_VERIFICATION) {
    return (
      <Navigate
        to="/wait-for-verification"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AccountStatusAuth;
