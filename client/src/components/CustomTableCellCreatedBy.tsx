import useGetUserName from "@/hooks/useGetUserName";
import { TableCell } from "@/components/ui/table";

const CustomTableCellCreatedBy = ({ userID }: { userID: string }) => {
  const username = useGetUserName(userID);

  return (
    <TableCell
      key={username}
      className="whitespace-nowrap text-[#424242] text-sm"
    >
      {username}
    </TableCell>
  );
};

export default CustomTableCellCreatedBy;
