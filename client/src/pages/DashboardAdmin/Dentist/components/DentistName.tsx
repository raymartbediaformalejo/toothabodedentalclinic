import { useGetDentist } from "@/service/queries";
import { TDentist, TDentistId } from "@/types/types";
import { createUsername } from "@/lib/utils";
import profileImgFallback from "@/assets/default-avatar.jpg";

const DentistName = ({ dentistId }: { dentistId: TDentistId }) => {
  const { data, isLoading, isFetched, isError } = useGetDentist(dentistId);
  const dentist: TDentist | null = isFetched ? data?.data : null;
  if (isError) {
    return (
      <label className="whitespace-nowrap text-[#424242] text-sm">
        Error getting dentist
      </label>
    );
  }
  if (isLoading) {
    return (
      <label className="whitespace-nowrap text-[#424242] text-sm">
        Loading...
      </label>
    );
  }

  return (
    <label
      key={dentistId}
      className="flex gap-[9px] items-center whitespace-nowrap text-[#424242] text-sm"
    >
      <span className="relative flex w-6 h-6 overflow-hidden border rounded-full select-none border-neutral-300 ">
        <img
          src={
            !!dentist?.profilePicUrl
              ? dentist.profilePicUrl
              : profileImgFallback
          }
          alt="Profile picture"
          className="w-full h-full aspect-square"
        />
      </span>
      <div>
        <span className="pr-1">Dr.</span>
        {dentist && (
          <span>
            {createUsername({
              firstname: dentist.firstName! || "",
              middlename: dentist.middleName! || "",
              lastname: dentist.lastName! || "",
            })}
          </span>
        )}
      </div>
    </label>
  );
};

export default DentistName;
