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
      <span style={{ color: textColor }} className="font-semibold">
        {status}
      </span>
    </div>
  );
};

export default AppointmentStatus;
