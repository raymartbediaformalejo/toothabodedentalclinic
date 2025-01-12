import { useGetUserAccountStatus } from "@/service/queries";
import { TUserAccountStatus } from "@/types/types";
import { ACCOUNT_STATUS } from "@/lib/variables";
import { Badge } from "@/components/ui/badge";

const AccountStatus = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUserAccountStatus(userId);

  console.log("AccountStatus userId: ", userId);
  console.log("AccountStatus data: ", data);

  const userAccountStatus: TUserAccountStatus = data || {
    accountStatus: "unknown",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Determine the styles based on account status
  const accountStatusKey = Object.values(ACCOUNT_STATUS).find(
    (status) => status.value === userAccountStatus.accountStatus
  );

  const backgroundColor = accountStatusKey?.background || "#FFFFFF"; // Default to white
  const textColor = accountStatusKey?.foreground || "#000000"; // Default to black

  return (
    <Badge
      style={{
        backgroundColor,
        color: textColor,
        borderColor: textColor,
      }}
      className="font-semibold text-nowrap"
    >
      {accountStatusKey?.label || "Unknown Status"}
    </Badge>
  );
};

export default AccountStatus;
