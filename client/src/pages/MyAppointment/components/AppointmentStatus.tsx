import { Badge } from "@/components/ui/badge";
import { APPOINTMENT_STATUS } from "@/lib/variables";

type TAppointmentStatusProps = {
  status: string;
};

const AppointmentStatus = ({ status }: TAppointmentStatusProps) => {
  const statusObject = Object.values(APPOINTMENT_STATUS).find(
    (statusItem) => statusItem.value === status
  );

  const textColor = statusObject ? statusObject.foreGround : "#000000";

  return (
    <div>
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
    </div>
  );
};

export default AppointmentStatus;
