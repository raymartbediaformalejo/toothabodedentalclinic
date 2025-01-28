import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import profileImgFallback from "@/assets/default-avatar.jpg";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ROW_PER_PAGE_OPTIONS } from "@/lib/variables";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useGetAllUsers } from "@/service/queries";
import { TUserId, TUserIds, TUserWithRole } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/customCheckbox";
import { LuArrowUp } from "react-icons/lu";
import { cn, createUsername, formatReadableDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationFirstPage,
  PaginationItem,
  PaginationLastPage,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

import { useDeleteAllUser, useDeleteUser } from "@/service/mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MdDeleteForever } from "react-icons/md";
import AccountStatus from "./components/AccountStatus";

const columnUsers = [
  {
    header: "User Name",
    accessorKey: "firstName",
  },
  {
    header: "Gender",
    accessorKey: "sex",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Account status",
    accessorKey: "accountStatus",
  },
  {
    header: "Roles",
    accessorKey: "roles",
  },
  {
    header: "Created at",
    accessorKey: "createdAt",
  },
];

const Users = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "firstName", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(6);
  const { data: allUserInfo, isLoading: isUserLoading } = useGetAllUsers();

  const allUsers: TUserWithRole[] = useMemo(
    () => allUserInfo?.data || [],
    [allUserInfo]
  );
  const deleteUser = useDeleteUser();
  const deleteAllUser = useDeleteAllUser();

  console.log("allUsers: ", allUsers);
  const table = useReactTable({
    data: allUsers,
    columns: columnUsers,
    initialState: {
      pagination: {
        pageSize: rowPerPage,
      },
    },
    state: {
      rowSelection,
      sorting,
    },
    getRowId: (row) => row.id as string,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  const selectedUserRow = Object.keys(table.getState().rowSelection);

  useEffect(() => {
    table.setPageSize(rowPerPage);
  }, [rowPerPage, table]);

  const handleRowPerPageChange = (value: number) => {
    setRowPerPage(value);
  };

  const onOpenModalChange = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onOpenDeleteAllModalChange = () => {
    setIsDeleteAllModalOpen((prev) => !prev);
  };

  const handleDeleteUser = async ({ userId }: { userId: TUserId }) => {
    try {
      await deleteUser.mutate(userId);
      setIsModalOpen(false);
      navigate(location.pathname, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAllUser = async (userIds: TUserIds) => {
    try {
      if (selectedUserRow.length) {
        setIsDeleteAllModalOpen(false);
        await deleteAllUser.mutate(userIds);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 ">
        <header className=" text-black/80">
          <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
            All Users
          </h1>
        </header>

        <div className="flex flex-row-reverse justify-between gap-3">
          <Dialog
            open={isDeleteAllModalOpen}
            onOpenChange={onOpenDeleteAllModalChange}
          >
            {selectedUserRow.length > 0 && (
              <Button
                variant="db_outline"
                size="lg"
                disabled={!selectedUserRow.length}
                onClick={onOpenDeleteAllModalChange}
                className="flex gap-1 font-semibold "
              >
                <span>Delete</span>
                <MdDeleteForever className="w-[19px] h-[19px] text-red/80" />
              </Button>
            )}
            <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
              <DialogHeader className="px-6 pt-8">
                <DialogTitle className="text-2xl font-bold text-center">
                  Delete user
                </DialogTitle>
                <DialogDescription className="text-center text-neutral-600">
                  Are you sure you want to delete all the selected users?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="px-6 py-4 bg-gray-100">
                <div className="flex items-center justify-center w-full gap-4">
                  <Button
                    size="lg"
                    variant="db_outline"
                    onClick={onOpenDeleteAllModalChange}
                  >
                    Cancel
                  </Button>
                  <Button
                    // variant="destructive"
                    size="lg"
                    className="rounded-md"
                    onClick={() =>
                      handleDeleteAllUser({ ids: selectedUserRow })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* =========== START TABLE ============= */}
      <Card className="bg-white shadow-sidebar-shadow overflow-hidden border-[rgba(46,32,0,0.1)]">
        {allUsers.length === 0 && !isUserLoading && (
          <div className="w-full flex items-center justify-center  py-6 h-[200px]">
            <p className="w-full italic text-center text-black/70 ">
              There are no records to display for Users
            </p>
          </div>
        )}
        {allUsers.length > 0 && (
          <Table className="font-inter ">
            <TableHeader className="bg-neutral-100">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <TableRow
                    key={headerGroup.id}
                    id={headerGroup.id}
                    className="h-auto"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <React.Fragment key={header.id}>
                          {header.id === "firstName" && (
                            <TableHead
                              key={header.id}
                              className="flex items-center ml-3"
                            >
                              <Checkbox
                                variant="white"
                                onChange={table.getToggleAllRowsSelectedHandler()}
                                checked={table.getIsAllPageRowsSelected()}
                              />

                              <div
                                className="-ml-3 h-full flex gap-2 transition-[background-color] duration-200 ease-in-out py-2 px-3 rounded-md data-[state=open]:bg-neutral-500 font-medium hover:bg-neutral-200 items-center [&>svg]:transition-[opacity,transform] [&>svg]:duration-150 [&>svg]:ease-in-out [&>svg]:hover:opacity-100"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {header.isPlaceholder ? null : (
                                  <span className="font-semibold select-none whitespace-nowrap">
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </span>
                                )}
                                {header.column.getIsSorted() ? (
                                  {
                                    asc: (
                                      <LuArrowUp className="w-4 h-4 text-neutral-500 " />
                                    ),
                                    desc: (
                                      <LuArrowUp className="w-4 h-4 -rotate-180 text-neutral-500 " />
                                    ),
                                    // prettier-ignore
                                    // @ts-expect-error: Unreachable code error
                                  }[header.column.getIsSorted()]
                                ) : (
                                  <LuArrowUp className="w-4 h-4 opacity-0 text-neutral-500" />
                                )}
                              </div>
                            </TableHead>
                          )}

                          {header.id !== "firstName" && (
                            <TableHead
                              key={header.id}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="w-min -ml-3 flex items-center gap-2 transition-[background-color] duration-200 ease-in-out py-2 px-3 rounded-md data-[state=open]:bg-neutral-500 font-medium hover:bg-neutral-200 [&>svg]:transition-[opacity,transform] [&>svg]:duration-150 [&>svg]:ease-in-out [&>svg]:hover:opacity-100">
                                {header.isPlaceholder ? null : (
                                  <span className="font-semibold select-none whitespace-nowrap">
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </span>
                                )}
                                {header.column.getIsSorted() ? (
                                  {
                                    asc: (
                                      <LuArrowUp className="w-4 h-4 text-neutral-500 " />
                                    ),
                                    desc: (
                                      <LuArrowUp className="w-4 h-4 -rotate-180 text-neutral-500 " />
                                    ),
                                    // prettier-ignore
                                    // @ts-expect-error: Unreachable code error
                                  }[header.column.getIsSorted()]
                                ) : (
                                  <LuArrowUp className="w-4 h-4 opacity-0 text-neutral-500" />
                                )}
                              </div>
                            </TableHead>
                          )}
                        </React.Fragment>
                      );
                    })}

                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                );
              })}
            </TableHeader>
            <TableBody className="w-full">
              {isUserLoading && (
                <div className="absolute flex flex-col w-full gap-1 py-1">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              )}
              {table.getRowModel().rows.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      isSelected={selectedUserRow.includes(
                        row.original.id as string
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <React.Fragment key={cell.id}>
                            {cell.column.id === "firstName" ? (
                              <TableCell
                                key={cell.id}
                                className="flex ml-3 text-[#424242] text-sm"
                              >
                                <Checkbox
                                  id={cell.id}
                                  onChange={row.getToggleSelectedHandler()}
                                  checked={row.getIsSelected()}
                                  className="h-[38px]"
                                />
                                <Link
                                  className="flex items-center"
                                  to={`/admin/users/${cell.row.original.id}`}
                                >
                                  <label
                                    key={row.original.id}
                                    className="flex gap-[9px] items-center whitespace-nowrap text-[#424242] text-sm"
                                  >
                                    <span className="relative flex w-6 h-6 overflow-hidden border rounded-full select-none border-neutral-300 ">
                                      <img
                                        src={profileImgFallback}
                                        alt="Profile picture"
                                        className="w-full h-full aspect-square"
                                      />
                                    </span>
                                    <div>
                                      <span>
                                        {createUsername({
                                          firstname: row.original.firstName!,
                                          middlename:
                                            row.original.middleName! || "",
                                          lastname: row.original.lastName!,
                                        })}
                                      </span>
                                    </div>
                                  </label>
                                </Link>
                              </TableCell>
                            ) : cell.column.id === "createdAt" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <span className="text-nowrap">
                                  {formatReadableDate(
                                    cell.row.original.createdAt as string
                                  )}
                                </span>
                              </TableCell>
                            ) : cell.column.id === "accountStatus" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <AccountStatus
                                  accountStatus={
                                    row.original.accountStatus as string
                                  }
                                />
                              </TableCell>
                            ) : cell.column.id === "sex" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    row.original.sex === "Male"
                                      ? "text-blue-800"
                                      : "text-pink-500"
                                  )}
                                >
                                  {row.original.sex}
                                </span>
                              </TableCell>
                            ) : cell.column.id === "roles" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <p>{row.original.roles[0]}</p>
                              </TableCell>
                            ) : (
                              <TableCell
                                key={cell.id}
                                className="text-[#424242] text-sm"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            )}
                          </React.Fragment>
                        );
                      })}

                      <TableCell>
                        <Popover>
                          <PopoverTrigger
                            id={row.original.id as string}
                            className="data-[state=open]:bg-black/10 transition-[background-color] duration-300 ease-in-out py-2 px-3 rounded-md hover:bg-black/10 "
                          >
                            <BsThreeDots />
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="flex flex-col p-0 w-[150px]"
                          >
                            <div className="w-full px-3 pt-2 pb-2">
                              <Button
                                size="sm"
                                className="w-full justify-between rounded-[4px] hover:bg-primary-400/20"
                                variant="db_outline"
                                onClick={() =>
                                  navigate(
                                    `/admin/users/${row.original.id as string}`
                                  )
                                }
                              >
                                <span>View</span>
                              </Button>
                            </div>
                            <div className="w-full px-3 pt-3 pb-2">
                              <Dialog
                                open={isModalOpen}
                                onOpenChange={onOpenModalChange}
                              >
                                <Button
                                  size="sm"
                                  className="w-full justify-between rounded-[4px] hover:bg-red/10 "
                                  variant="db_outline"
                                  onClick={onOpenModalChange}
                                >
                                  <span>Delete</span>
                                  <MdDeleteForever className="w-5 h-5 ml-6 text-red/70" />
                                </Button>
                                <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                                  <DialogHeader className="px-6 pt-8">
                                    <DialogTitle className="text-2xl font-bold text-center">
                                      Delete user
                                    </DialogTitle>
                                    <DialogDescription className="text-center text-neutral-600">
                                      Are you sure you want to do this? <br />
                                      <span className="font-semibold text-primary-600">
                                        {`${createUsername({
                                          firstname: row.original.firstName,
                                          middlename:
                                            row.original.middleName || "",
                                          lastname: row.original.lastName,
                                        })} `}
                                      </span>
                                      will be move to trash.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="px-6 py-4 bg-gray-100">
                                    <div className="flex items-center justify-center w-full gap-4">
                                      <Button
                                        className="rounded-md"
                                        onClick={onOpenModalChange}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="rounded-md"
                                        onClick={() =>
                                          handleDeleteUser({
                                            userId: row.original.id as string,
                                          })
                                        }
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
      {/* =========== END TABLE ============= */}
      {!!allUsers.length && (
        <div className="flex justify-between my-8 text-sm ">
          <p
            className={cn(
              "flex transition-colors duration-100 ease-in-out place-items-center font-inter ",
              selectedUserRow.length ? "text-black" : "text-black/60"
            )}
          >
            {`${selectedUserRow.length} of ${allUsers.length} row(s) selected.`}
          </p>

          <div className="flex justify-around gap-6">
            <div className="flex items-center gap-2">
              <span className="font-inter whitespace-nowrap">
                Rows per page
              </span>
              <Select
                defaultValue="6"
                onValueChange={(e) => handleRowPerPageChange(+e)}
              >
                <SelectTrigger
                  arrowDesign="up-and-down"
                  variant="secondary"
                  size="sm"
                  className="max-w-[70px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROW_PER_PAGE_OPTIONS.map((value) => (
                    <SelectItem key={value} id={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="flex items-center justify-center font-inter whitespace-nowrap ">
              {`Page ${table.getState().pagination.pageIndex + 1} of 
            ${table.getPageCount()}`}
            </p>
            {/* =========== START PAGINATION ============= */}
            <Pagination className="">
              <PaginationContent className="flex gap-1">
                <PaginationItem className="hidden sm:hidden md:inline-flex">
                  <PaginationFirstPage
                    className="disabled:cursor-not-allowed"
                    size="icon"
                    isActive={table.getCanPreviousPage()}
                    onClick={() => table.setPageIndex(0)}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    size="icon"
                    isActive={table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    size="icon"
                    isActive={table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                  />
                </PaginationItem>
                <PaginationItem className="hidden sm:hidden md:inline-flex">
                  <PaginationLastPage
                    size="icon"
                    isActive={table.getCanNextPage()}
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            {/* =========== END PAGINATION ============= */}
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
