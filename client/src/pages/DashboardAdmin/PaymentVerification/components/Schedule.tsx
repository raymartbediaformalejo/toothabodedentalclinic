import { Badge } from "@/components/ui/badge";
import { formatReadableDate } from "@/lib/utils";
import { useGetMyAppointment } from "@/service/queries";
import { TMyAppointment } from "@/types/types";

const Schedule = ({ appointmentId }: { appointmentId: string }) => {
  const {
    data: appoitmentData,
    isLoading,
    isError,
  } = useGetMyAppointment(appointmentId);
  const appointment: TMyAppointment | undefined = appoitmentData?.data;

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error</p>;
  }

  return (
    <Badge className=" text-nowrap w-min">
      {appointment?.schedule ? formatReadableDate(appointment?.schedule!) : ""}
    </Badge>
  );
};

export default Schedule;
