import { Badge } from "@/components/ui/badge";
import { PAYMENT_VERIFICATION_STATUS } from "@/lib/variables";

type TPaymentVerificationStatusProps = {
  status: string;
};

const PaymentVerificationStatus = ({
  status,
}: TPaymentVerificationStatusProps) => {
  const statusObject = Object.values(PAYMENT_VERIFICATION_STATUS).find(
    (statusItem) => statusItem.value === status
  );

  const textColor = statusObject ? statusObject.foreGround : "#000000";

  return (
    <Badge
      variant="outline"
      style={{
        color: textColor,
        borderColor: statusObject?.foreGround,
        backgroundColor: statusObject?.backGround,
      }}
      className="font-semibold text-nowrap"
    >
      {statusObject?.label}
    </Badge>
  );
};

export default PaymentVerificationStatus;
