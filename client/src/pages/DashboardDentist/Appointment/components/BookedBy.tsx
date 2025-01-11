import { createUsername } from "@/lib/utils";
import { useGetUser } from "@/service/queries";
import { TUser } from "@/types/types";

const BookedBy = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUser(userId);
  const user: TUser = data?.data;

  console.log("BookedBy user: ", user);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {createUsername({
        firstname: user.firstName,
        middlename: user.middleName || "",
        lastname: user.lastName,
      })}
    </div>
  );
};

export default BookedBy;
