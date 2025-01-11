import { createUsername } from "@/lib/utils";
import { useGetAppointmentPatientInfo } from "@/service/queries";
import { TPatientInfo } from "@/types/types";

const BookedFor = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetAppointmentPatientInfo(userId!);
  const patient: TPatientInfo = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {createUsername({
        firstname: patient.firstName,
        middlename: patient.middleName || "",
        lastname: patient.lastName,
      })}
    </div>
  );
};

export default BookedFor;
