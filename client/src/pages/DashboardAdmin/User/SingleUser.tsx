import {
  useGetAppointmentPatientInfo,
  useGetPatientAppointments,
  useGetUser,
} from "@/service/queries";
import {
  TMyAppointment,
  TPatientInfo,
  TRequestDateAndTime,
  TUser,
} from "@/types/types";

import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  createUsername,
  formatDate,
  formatDateTo12Hour,
  formatReadableDate,
  isScheduleInPast,
} from "@/lib/utils";

import MedicalHistory from "@/pages/DashboardDentist/Appointment/components/MedicalHistory";
import CreatedBy from "@/pages/DashboardDentist/Patient/components/CreatedBy";
import AccountStatus from "@/pages/DashboardDentist/Patient/components/AccountStatus";
import { Badge } from "@/components/ui/badge";
import {
  useCancelAppointment,
  useRequestRescheduleAppointment,
} from "@/service/mutation";
import React, { useEffect, useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestDateTimeSchema } from "@/types/schema";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LuArrowUp } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import Services from "@/pages/MyAppointment/components/Services";
import DentistName from "../Dentist/components/DentistName";
import AppointmentStatus from "@/pages/MyAppointment/components/AppointmentStatus";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDots } from "react-icons/bs";
import { APPOINTMENT_STATUS, ROW_PER_PAGE_OPTIONS } from "@/lib/variables";
import { Dialog } from "@/components/ui/dialog";
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
const columnMyAppointment = [
  {
    header: "Dentist",
    accessorKey: "dentistId",
  },
  {
    header: "Requested Date & Time",
    accessorKey: "schedule",
  },
  {
    header: "Service",
    accessorKey: "services",
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
const SingleUser = () => {
  const { id } = useParams();

  console.log("id: ", id);

  const { data: userData, isLoading: isLoadingUser } = useGetUser(id!);
  const user: TUser = userData?.data;

  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [rowPerPage, setRowPerPage] = useState(6);
  const { data, isLoading } = useGetPatientAppointments(id!);
  const allMyAppoinment: TMyAppointment[] = useMemo(
    () => data?.data || [],
    [data]
  );
  console.log("user: ", user);
  console.log("allMyAppoinment: ", allMyAppoinment);

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

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" max-w-[1200px] mx-auto mb-12">
      <header className=" text-black/80">
        <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
          User Details
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card className="w-[35%]">
          <CardHeader>
            <p>User profile</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Patient name:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {createUsername({
                  firstname: user?.firstName || "",
                  middlename: user?.middleName || "",
                  lastname: user?.lastName || "",
                })}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">
                Account status:
              </span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                <Badge>{user.accountStatus}</Badge>
                {/* <AccountStatus userId={patient.createdBy as string} /> */}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Nickname:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.nickname || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Gender:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.sex || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Age:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.age || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Birthday:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {formatDate(user.birthDay) || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-wrap text-neutral-500/90">
                Email:
              </span>
              <p className="gap-4 text-sm break-words text-neutral-800">
                {user.email || "N/A"}
              </p>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Phone:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.mobileNo || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Occupation:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.occupation || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Religion:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.religion || "N/A"}
              </span>
            </div>
            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">Nationality:</span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {user.nationality || "N/A"}
              </span>
            </div>

            <div className="grid items-center grid-cols-2">
              <span className="text-sm text-neutral-500/90">
                Account creation:
              </span>
              <span className="gap-4 text-sm break-words text-neutral-800">
                {formatReadableDate(user.createdAt as string)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-[70%]">
          <CardHeader className="flex flex-row items-center justify-between ">
            Appointment History
          </CardHeader>

          <CardContent className="flex flex-col w-full gap-6 pt-2 mb-8">
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
                                      onClick={() =>
                                        navigate(
                                          `/admin/appointments/${row.original.id}`
                                        )
                                      }
                                      className="text-[#424242] text-sm"
                                    >
                                      <Services
                                        serviceIds={cell.row.original.services}
                                      />
                                    </TableCell>
                                  ) : cell.column.id === "schedule" ? (
                                    <TableCell
                                      key={cell.id}
                                      onClick={() =>
                                        navigate(
                                          `/admin/appointments/${row.original.id}`
                                        )
                                      }
                                      className="text-[#424242] text-sm"
                                    >
                                      {formatDateTo12Hour(
                                        cell.row.original.schedule
                                      )}
                                    </TableCell>
                                  ) : cell.column.id === "dentistId" ? (
                                    <TableCell
                                      key={cell.id}
                                      className="text-[#424242] text-sm"
                                      onClick={() =>
                                        navigate(
                                          `/admin/appointments/${row.original.id}`
                                        )
                                      }
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
                          onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
                {/* =========== END PAGINATION ============= */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SingleUser;
