import { useGetDentist } from "@/service/queries";
import { TDentist, TDentistId } from "@/types/types";
import { createUsername } from "@/lib/utils";
import profileImgFallback from "@/assets/default-avatar.jpg";

const DentistName = ({ dentistId }: { dentistId: TDentistId }) => {
  const { data, isFetched } = useGetDentist(dentistId);
  const dentist: TDentist | null = isFetched ? data.data[0] : null;

  if (!dentist) {
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
      <span className="relative flex w-6 h-6 overflow-hidden rounded-full select-none ">
        <img
          src={
            dentist.profilePicUrl ? dentist.profilePicUrl : profileImgFallback
          }
          alt="Profile picture"
          className="w-full h-full aspect-square"
        />
      </span>
      <div>
        <span className="pr-1">Dr.</span>
        <span>
          {createUsername({
            firstname: dentist.firstName || "",
            middlename: dentist.middleName || "",
            lastname: dentist.lastName || "",
          })}
        </span>
      </div>
    </label>
  );
};

export default DentistName;
