import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ROW_PER_PAGE_OPTIONS } from "@/lib/variables";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useGetAllDentist } from "@/service/queries";
import { TDentist, TDentistId, TDentistIds } from "@/types/types";
import { useDeleteAllDentist, useDeleteDentist } from "@/service/mutation";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MdDeleteForever } from "react-icons/md";
import { Checkbox } from "@/components/ui/customCheckbox";
import { LuArrowUp } from "react-icons/lu";
import { cn, createUsername } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdEdit } from "react-icons/md";
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
import DentistName from "./components/DentistName";
import AvailabilityCell from "./components/AvailabilityCell";

const columnDentist = [
  {
    header: "name",
    accessorKey: "firstName",
  },
  {
    header: "Workind days",
    accessorKey: "monday",
  },
];

const Dentists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "firstName", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(6);
  const { data, isLoading } = useGetAllDentist();
  const allDentists: TDentist[] = useMemo(() => data?.data || [], [data]);
  const deleteAllDentist = useDeleteAllDentist();
  const deleteDentist = useDeleteDentist();
  const table = useReactTable({
    data: allDentists,
    columns: columnDentist,
    initialState: {
      pagination: {
        pageSize: rowPerPage,
      },
    },
    state: {
      rowSelection,
      sorting,
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  const selectedDentistRow = Object.keys(table.getState().rowSelection);

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

  const handleDeleteDentist = async ({
    dentistId,
  }: {
    dentistId: TDentistId;
  }) => {
    try {
      await deleteDentist.mutate(dentistId);
      setIsModalOpen(false);
      navigate(location.pathname, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAllDentist = async (dentistIds: TDentistIds) => {
    try {
      if (selectedDentistRow.length) {
        setIsDeleteAllModalOpen(false);
        await deleteAllDentist.mutate(dentistIds);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("allDentists: ", allDentists);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <header className=" text-black/80">
          <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
            Dentists
          </h1>
        </header>

        <div className="flex flex-row-reverse justify-between gap-3">
          <Button variant="db_default" size="lg" asChild>
            <Link to="add_new_dentist">
              <span>Add new dentist</span> <FiPlus className="w-4 h-4" />
            </Link>
          </Button>
          <Dialog
            open={isDeleteAllModalOpen}
            onOpenChange={onOpenDeleteAllModalChange}
          >
            {selectedDentistRow.length > 0 && (
              <Button
                variant="db_outline"
                size="lg"
                disabled={!selectedDentistRow.length}
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
                  Delete dentist
                </DialogTitle>
                <DialogDescription className="text-center text-neutral-600">
                  Are you sure you want to delete all the selected dentists?
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
                      handleDeleteAllDentist({ ids: selectedDentistRow })
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
        {allDentists.length === 0 && !isLoading && (
          <div className="w-full flex items-center justify-center  py-6 h-[200px]">
            <p className="w-full italic text-center text-black/70 ">
              There are no records to display for Dentists
            </p>
          </div>
        )}
        {allDentists.length > 0 && (
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
              {isLoading && (
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
                      isSelected={selectedDentistRow.includes(row.original.id)}
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
                                <DentistName dentistId={cell.row.original.id} />
                              </TableCell>
                            ) : cell.column.id === "monday" ? (
                              <TableCell key={cell.id} className="">
                                <div className="flex gap-1">
                                  <AvailabilityCell
                                    key="sunday"
                                    dayOfWeek="Sunday"
                                    availability={cell.row.original?.sunday}
                                  />
                                  <AvailabilityCell
                                    key="monday"
                                    dayOfWeek="Monday"
                                    availability={cell.row.original?.monday}
                                  />
                                  <AvailabilityCell
                                    key="tuesday"
                                    dayOfWeek="Tuesday"
                                    availability={cell.row.original?.tuesday}
                                  />
                                  <AvailabilityCell
                                    key="wednesday"
                                    dayOfWeek="Wednesday"
                                    availability={cell.row.original?.wednesday}
                                  />
                                  <AvailabilityCell
                                    key="thursday"
                                    dayOfWeek="Thursday"
                                    availability={cell.row.original?.thursday}
                                  />
                                  <AvailabilityCell
                                    key="friday"
                                    dayOfWeek="Friday"
                                    availability={cell.row.original?.friday}
                                  />
                                  <AvailabilityCell
                                    key="saturday"
                                    dayOfWeek="Saturday"
                                    availability={cell.row.original?.saturday}
                                  />
                                </div>
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
                            id={row.original.id}
                            className="data-[state=open]:bg-black/10 transition-[background-color] duration-300 ease-in-out py-2 px-3 rounded-md hover:bg-black/10 "
                          >
                            <BsThreeDots />
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="flex flex-col p-0 w-[150px]"
                          >
                            <div className="px-3 pt-3 pb-2 border-b border-black/10">
                              <Button
                                size="sm"
                                className=" w-full justify-between rounded-[4px] hover:bg-primary-400/20"
                                variant="db_outline"
                                onClick={() =>
                                  navigate(`/admin/dentists/${row.original.id}`)
                                }
                              >
                                <span>Edit</span>
                                <MdEdit className="w-5 h-5 ml-4 text-primary-400 " />
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
                                      Delete dentist
                                    </DialogTitle>
                                    <DialogDescription className="text-center text-neutral-600">
                                      Are you sure you want to do this? <br />
                                      <span className="font-semibold text-primary-600">
                                        {`${createUsername({
                                          firstname: row.original.firstName,
                                          middlename: row.original.middleName!,
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
                                          handleDeleteDentist({
                                            dentistId: row.original.id,
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
      {!!allDentists.length && (
        <div className="flex justify-between my-8 text-sm ">
          <p
            className={cn(
              "flex transition-colors duration-100 ease-in-out place-items-center font-inter ",
              selectedDentistRow.length ? "text-black" : "text-black/60"
            )}
          >
            {`${selectedDentistRow.length} of ${allDentists.length} row(s) selected.`}
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

export default Dentists;
