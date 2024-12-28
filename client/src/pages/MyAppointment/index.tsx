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
import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useGetMyAllAppointment } from "@/service/queries";
import { TMyAppointment } from "@/types/types";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

import { LuArrowUp } from "react-icons/lu";
import { formatDateTo12Hour, formatReadableDate } from "@/lib/utils";
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
import useAuth from "@/hooks/useAuth";
import Services from "./components/Services";
import DentistName from "../DashboardAdmin/Dentist/components/DentistName";
import AppointmentStatus from "./components/AppointmentStatus";

const columnMyAppointment = [
  {
    header: "Service",
    accessorKey: "services",
  },
  {
    header: "Requested Date & Time",
    accessorKey: "schedule",
  },
  {
    header: "Dentist",
    accessorKey: "dentistId",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Created at",
    accessorKey: "createdAt",
  },
];

const MyAppointment = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [rowPerPage, setRowPerPage] = useState(6);
  const { data, isLoading } = useGetMyAllAppointment(userId);
  const allMyAppoinment: TMyAppointment[] = useMemo(
    () => data?.data || [],
    [data]
  );

  const table = useReactTable({
    data: allMyAppoinment,
    columns: columnMyAppointment,
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

  useEffect(() => {
    table.setPageSize(rowPerPage);
  }, [rowPerPage, table]);

  const handleRowPerPageChange = (value: number) => {
    setRowPerPage(value);
  };

  console.log("allMyAppoinment: ", allMyAppoinment);

  return (
    <div className="mx-4 my-10 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <header className=" text-black/80">
          <h1 className=" text-[24px] text-neutral-700 leading-[43.2px] font-bold md:text-[34px]">
            My Appointments
          </h1>
        </header>

        <div className="flex flex-row-reverse justify-between gap-3">
          <Button variant="db_default" asChild>
            <Link to="/">
              <span>Book Appointment</span> <FiPlus className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* =========== START TABLE ============= */}
      <Card className="bg-white shadow-sidebar-shadow overflow-hidden  border-[rgba(46,32,0,0.1)]">
        {allMyAppoinment.length === 0 && !isLoading && (
          <div className="w-full flex items-center justify-center  py-6 h-[200px]">
            <p className="w-full italic text-center text-black/70 ">
              There are no records to display for Appoitment
            </p>
          </div>
        )}
        {allMyAppoinment.length > 0 && (
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
                          {header.id === "services" && (
                            <TableHead
                              key={header.id}
                              className="flex items-center ml-4"
                            >
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

                          {header.id !== "services" && (
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
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <React.Fragment key={cell.id}>
                            {cell.column.id === "services" ? (
                              <TableCell
                                key={cell.id}
                                className="text-[#424242] text-sm"
                              >
                                <Services
                                  serviceIds={cell.row.original.services}
                                />
                              </TableCell>
                            ) : cell.column.id === "schedule" ? (
                              <TableCell
                                key={cell.id}
                                className="text-[#424242] text-sm"
                              >
                                {formatDateTo12Hour(cell.row.original.schedule)}
                              </TableCell>
                            ) : cell.column.id === "dentistId" ? (
                              <TableCell
                                key={cell.id}
                                className="text-[#424242] text-sm"
                              >
                                <DentistName
                                  dentistId={cell.row.original.dentistId}
                                />
                              </TableCell>
                            ) : cell.column.id === "status" ? (
                              <TableCell
                                key={cell.id}
                                className="text-[#424242] text-sm"
                              >
                                <AppointmentStatus
                                  status={cell.row.original.status}
                                />
                              </TableCell>
                            ) : cell.column.id === "createdAt" ? (
                              <TableCell
                                key={cell.id}
                                className="text-[#424242] text-sm"
                              >
                                <span className="whitespace-nowrap">
                                  {formatReadableDate(
                                    cell.row.original.createdAt
                                  )}
                                </span>
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
      {!!allMyAppoinment.length && (
        <div className="flex justify-between my-8 text-sm ">
          <div className="flex items-center gap-2">
            <span className="font-inter whitespace-nowrap">Rows per page</span>
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

          {/* =========== START PAGINATION ============= */}
          <div className="flex gap-4">
            <p className="flex items-center justify-center font-inter whitespace-nowrap ">
              {`Page ${table.getState().pagination.pageIndex + 1} of 
            ${table.getPageCount()}`}
            </p>
            <Pagination>
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
          </div>
          {/* =========== END PAGINATION ============= */}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
