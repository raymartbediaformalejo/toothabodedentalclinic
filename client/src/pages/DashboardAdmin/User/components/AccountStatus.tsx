import { ACCOUNT_STATUS } from "@/lib/variables";
import { Badge } from "@/components/ui/badge";

const AccountStatus = ({ accountStatus }: { accountStatus: string }) => {
  // Determine the styles based on account status
  const accountStatusKey = Object.values(ACCOUNT_STATUS).find(
    (status) => status.value === accountStatus
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
