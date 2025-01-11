import { Separator } from "@/components/ui/separator";
import { useGetMedicalHistory } from "@/service/queries";
import { TMedicalHistory } from "@/types/types";

const MedicalHistory = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetMedicalHistory(id!);
  const medicalHistory: TMedicalHistory = data?.data;

  console.log("MedicalHistory: ", medicalHistory);
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
        <span className="text-sm text-neutral-500/90">Physician name:</span>
        <span className="self-start gap-4 text-sm break-words text-neutral-800">
          {medicalHistory.physicianName || "N/A"}
        </span>
      </div>
      <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
        <span className="text-sm text-neutral-500/90">
          Physician mobile no:
        </span>
        <span className="self-start gap-4 text-sm break-words text-neutral-800">
          {medicalHistory.physicianMobileNo || "N/A"}
        </span>
      </div>

      <Separator />

      <ol className="flex flex-col w-full gap-6 pt-2 pl-5">
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Are you in good health?
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question1 ? "Yes" : "No"}
          </span>
        </div>
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Are you under medical treatment now?
          </li>

          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question2.answer ? "Yes" : "No"}
          </span>
        </div>
        {medicalHistory.question2.answer && (
          <div className="grid items-center grid-cols-[1fr,1fr] gap-4 -mt-4">
            <span className="gap-4 ml-4 text-sm text-neutral-500/90">
              a. If so, what is the condition being treated?
            </span>
            <span className="self-start gap-4 text-sm break-words text-neutral-800">
              {medicalHistory.question2.subAnswer}
            </span>
          </div>
        )}
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Have you ever had serious illness or surgical operation?
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question3.answer ? "Yes" : "No"}
          </span>
        </div>
        {medicalHistory.question3.answer && (
          <div className="grid items-center grid-cols-[1fr,1fr] gap-4 -mt-4">
            <span className="gap-4 ml-4 text-sm text-neutral-500/90">
              a. If so, what illness or operations?
            </span>
            <span className="self-start gap-4 text-sm break-words text-neutral-800">
              {medicalHistory.question3.subAnswer}
            </span>
          </div>
        )}
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Have you ever been hospitalized?
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question4.answer ? "Yes" : "No"}
          </span>
        </div>
        {medicalHistory.question4.answer && (
          <div className="grid items-center grid-cols-[1fr,1fr] gap-4 -mt-4">
            <span className="gap-4 ml-4 text-sm text-neutral-500/90">
              a. If so, when and why?
            </span>
            <span className="self-start gap-4 text-sm break-words text-neutral-800">
              {medicalHistory.question4.subAnswer}
            </span>
          </div>
        )}
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Are you taking any prescription/non-prescription medication?
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question1 ? "Yes" : "No"}
          </span>
        </div>
        {medicalHistory.question5.answer && (
          <div className="grid items-center grid-cols-[1fr,1fr] gap-4 -mt-4">
            <span className="gap-4 ml-4 text-sm text-neutral-500/90">
              a. If yes, please specify:{" "}
            </span>
            <span className="self-start gap-4 text-sm break-words text-neutral-800">
              {medicalHistory.question5.subAnswer}
            </span>
          </div>
        )}
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Do you use tobacco products/smoke?
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question1 ? "Yes" : "No"}
          </span>
        </div>
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Do you use alcohol, cocaine or other dangerous drugs?
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question1 ? "Yes" : "No"}
          </span>
        </div>
        <div className="grid items-center grid-cols-[1fr,1fr] gap-4">
          <li className="text-sm list-decimal text-neutral-500/90">
            Are you allergic to any of the following:
          </li>
          <span className="gap-4 text-sm break-words text-neutral-800">
            {medicalHistory.question1 ? "Yes" : "No"}
          </span>
        </div>
      </ol>
    </>
  );
};

export default MedicalHistory;
