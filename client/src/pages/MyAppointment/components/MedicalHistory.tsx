import { useGetMedicalHistory } from "@/service/queries";
import { TMedicalHistory } from "@/types/types";

type TMedicalHistoryProps = {
  id: string;
};

const MedicalHistory = ({ id }: TMedicalHistoryProps) => {
  const { data } = useGetMedicalHistory(id);
  const medicalHistory: TMedicalHistory | undefined = data?.data;
  console.log("medicalHistory: ", medicalHistory);
  return <div>MedicalHistory</div>;
};

export default MedicalHistory;
