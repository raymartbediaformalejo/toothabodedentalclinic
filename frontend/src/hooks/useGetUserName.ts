import { useGetUser } from "@/service/queries";
import { TUser } from "@/types/types";
import { createUsername } from "@/lib/utils";
const useGetUserName = (userID: string) => {
  const { data, isFetched } = useGetUser(userID);
  const user: TUser = isFetched ? data.data[0] : null;

  const userName = createUsername({
    lastname: user?.lastName,
    middlename: user?.middleName,
    firstname: user?.firstName,
  });
  if (userName) {
    return userName;
  } else {
    return null;
  }
};

export default useGetUserName;
