import { createUsername } from "@/lib/utils";
import { useGetUser } from "@/service/queries";
import { TUser } from "@/types/types";

const CreatedBy = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUser(userId);
  const user: TUser = data?.data;
  if (isLoading) return <span>Loading...</span>;
  return (
    <span>
      {createUsername({
        firstname: user.firstName!,
        middlename: user.middleName! || "",
        lastname: user.lastName!,
      })}
    </span>
  );
};

export default CreatedBy;
