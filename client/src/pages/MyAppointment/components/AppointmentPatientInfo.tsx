import { useGetAppointmentPatientInfo } from "@/service/queries";
import { TPatientInfoWithId } from "@/types/types";

type TAppointmentPatienInfoProps = {
  id: string;
};

const AppointmentPatientInfo = ({ id }: TAppointmentPatienInfoProps) => {
  const { data: patientInfoData } = useGetAppointmentPatientInfo(id);
  const appointmentPatientInfo: TPatientInfoWithId | undefined =
    patientInfoData?.data;

  console.log("appointmentPatientInfo: ", appointmentPatientInfo);
  return <div>AppointmentPatientInfo</div>;
};

export default AppointmentPatientInfo;
