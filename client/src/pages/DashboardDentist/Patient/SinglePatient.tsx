import { useGetAppointmentPatientInfo } from "@/service/queries";
import { TPatientInfo } from "@/types/types";

import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { createUsername, formatDate, formatReadableDate } from "@/lib/utils";

import MedicalHistory from "../Appointment/components/MedicalHistory";
import CreatedBy from "./components/CreatedBy";
import AccountStatus from "./components/AccountStatus";

const SinglePatient = () => {
  const { id: patientId } = useParams();

  const { data, isLoading } = useGetAppointmentPatientInfo(patientId!);
  const patient: TPatientInfo = data?.data;
  console.log("patient", patient);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" max-w-[1200px] mx-auto mb-12">
      <header className=" text-black/80">
        <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
          Patient Details
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card className="w-[35%]">
          <CardHeader>
            <p>Patient profile</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Patient name:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {createUsername({
                  firstname: patient.firstName!,
                  middlename: patient.middleName! || "",
                  lastname: patient.lastName!,
                })}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Nickname:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.nickname || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Gender:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.sex || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Age:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.age || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Birthday:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {formatDate(patient.birthDay) || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-wrap text-neutral-500/90">
                Email:
              </span>
              <p className="gap-4 text-sm break-words text-neutral-800">
                {patient.email || "N/A"}
              </p>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Phone:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.mobileNo || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Occupation:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.occupation || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Religion:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.religion || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Nationality:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {patient.nationality || "N/A"}
              </span>
            </div>

            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">
                Account status:
              </span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                <AccountStatus userId={patient.createdBy as string} />
              </span>
            </div>

            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Created by:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                <CreatedBy userId={patient.createdBy as string} />
              </span>
            </div>

            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Created at:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {formatReadableDate(patient.createdAt as string)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-[70%]">
          <CardHeader className="flex flex-row items-center justify-between ">
            Medical history
          </CardHeader>

          <CardContent className="flex flex-col w-full gap-6 pt-2 mb-8">
            <MedicalHistory id={patient.medicalHistoryId as string} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SinglePatient;
