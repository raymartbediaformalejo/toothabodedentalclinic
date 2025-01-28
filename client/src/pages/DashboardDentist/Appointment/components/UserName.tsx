import { useGetUser } from "@/service/queries";
import { TUser } from "@/types/types";
import { createUsername } from "@/lib/utils";
import profileImgFallback from "@/assets/default-avatar.jpg";

const UserName = ({ userId }: { userId: string }) => {
  console.log("userId: ", userId);
  const { data, isLoading, isFetched, isError } = useGetUser(userId);
  const user: TUser | null = isFetched ? data?.data : null;

  if (isLoading) {
    return (
      <label className="whitespace-nowrap text-[#424242] text-sm">
        Loading...
      </label>
    );
  }

  if (isError) {
    return (
      <label className="whitespace-nowrap text-[#424242] text-sm">
        Error getting patient name
      </label>
    );
  }

  return (
    <label
      key={userId}
      className="flex gap-[9px] items-center whitespace-nowrap text-[#424242] text-sm"
    >
      <span className="relative flex w-6 h-6 overflow-hidden border rounded-full select-none border-neutral-300 ">
        <img
          src={!!user?.profilePicUrl ? user.profilePicUrl : profileImgFallback}
          alt="Profile picture"
          className="w-full h-full aspect-square"
        />
      </span>
      <div>
        {user && (
          <span>
            {createUsername({
              firstname: user.firstName!,
              middlename: user.middleName! || "",
              lastname: user.lastName!,
            })}
          </span>
        )}
      </div>
    </label>
  );
};

export default UserName;
