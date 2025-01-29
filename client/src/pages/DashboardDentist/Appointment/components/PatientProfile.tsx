import { CardContent } from "@/components/ui/card";
import { cn, createUsername, formatDate } from "@/lib/utils";
import { APPOINTMENT_STATUS } from "@/lib/variables";
import { useGetAppointmentPatientInfo } from "@/service/queries";
import { TPatientInfo } from "@/types/types";

type PatientProfileProps = {
  patientId: string;
  isPenaltyPaid: string;
  appointmentStatus: string;
};

const PatientProfile = ({
  patientId,
  isPenaltyPaid,
  appointmentStatus,
}: PatientProfileProps) => {
  const { data, isLoading } = useGetAppointmentPatientInfo(patientId!);
  const patientInfo: TPatientInfo = data?.data;
  console.log("data: ", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Patient name:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {createUsername({
            firstname: patientInfo.firstName!,
            middlename: patientInfo.middleName! || "",
            lastname: patientInfo.lastName!,
          })}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Nickname:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.nickname || "N/A"}
        </span>
      </div>
      {appointmentStatus === APPOINTMENT_STATUS.NO_SHOW.value ? (
        <div className="grid items-center grid-cols-2">
          <span className="text-sm text-neutral-500/90">Is Penalty Paid:</span>
          <span
            className={cn(
              "capitalize gap-4 text-sm break-words font-semibold",
              isPenaltyPaid === "yes" && "text-green-800",
              isPenaltyPaid === "no" && "text-red-800"
            )}
          >
            {isPenaltyPaid}
          </span>
        </div>
      ) : null}

      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Gender:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.sex || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Age:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.age || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Birthday:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {formatDate(patientInfo.birthDay) || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-wrap text-neutral-500/90">Email:</span>
        <p className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.email || "N/A"}
        </p>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Phone:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.mobileNo || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Occupation:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.occupation || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Religion:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.religion || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-2">
        <span className="text-sm text-neutral-500/90">Nationality:</span>
        <span className="gap-4 text-sm break-words text-neutral-800">
          {patientInfo.nationality || "N/A"}
        </span>
      </div>
    </CardContent>
  );
};

export default PatientProfile;
