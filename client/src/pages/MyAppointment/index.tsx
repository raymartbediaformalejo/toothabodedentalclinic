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
import {
  APPOINTMENT_STATUS,
  ROW_PER_PAGE_OPTIONS,
  TIME_LIST,
  TOOTH_ABODE_FB_URL,
} from "@/lib/variables";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useGetPatientAppointments } from "@/service/queries";
import { TMyAppointment, TRequestDateAndTime } from "@/types/types";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

import { LuArrowUp } from "react-icons/lu";
import {
  canRequestReschedule,
  cn,
  formatAppointmentDate,
  formatDate,
  formatDateTo12Hour,
  formatReadableDate,
  isScheduleInPast,
} from "@/lib/utils";
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
import useAuth from "@/hooks/useAuth";
import Services from "./components/Services";
import DentistName from "../DashboardAdmin/Dentist/components/DentistName";
import AppointmentStatus from "./components/AppointmentStatus";
import H1 from "@/components/ui/H1";
import {
  useCancelAppointment,
  useRequestRescheduleAppointment,
} from "@/service/mutation";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestDateTimeSchema } from "@/types/schema";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isSameWeek,
  isToday,
  isPast,
  startOfWeek,
  addWeeks,
  subWeeks,
  set,
} from "date-fns";
import { MdPlayArrow } from "react-icons/md";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

const MyAppointments = () => {
  const requestRescheduleAppointment = useRequestRescheduleAppointment();
  const [isCancelAppointmentModalOpen, setIsCancelAppointmentModalOpen] =
    useState(false);
  const [
    isRescheduleAppointmentModalOpen,
    setIsRescheduleAppointmentModalOpen,
  ] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [rowPerPage, setRowPerPage] = useState(6);
  const { data, isLoading } = useGetPatientAppointments(userId);
  const allMyAppoinment: TMyAppointment[] = useMemo(
    () => data?.data || [],
    [data]
  );
  console.log("allMyAppoinment: ", allMyAppoinment);
  const cancelAppointment = useCancelAppointment();

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
  const onOpenChange = () => {
    setIsCancelAppointmentModalOpen((prev) => !prev);
    form.setValue("date", "");
    form.setValue("time", "");
  };

  const onOpenRescheduleChange = () => {
    setIsRescheduleAppointmentModalOpen((prev) => !prev);
    form.setValue("date", "");
    form.setValue("time", "");
  };
  useEffect(() => {
    table.setPageSize(rowPerPage);
  }, [rowPerPage, table]);

  const handleRowPerPageChange = (value: number) => {
    setRowPerPage(value);
  };

  const handleCancelAppointment = async (id: string) => {
    if (id) {
      cancelAppointment.mutate({ id });
      setIsCancelAppointmentModalOpen(false);
    }
  };

  const handleRequestRescheduleAppointment = async (appointmentId: string) => {
    if (appointmentId) {
      requestRescheduleAppointment.mutate({
        appointmentId,
        date: form.watch("date"),
        time: form.watch("time"),
      });
      setIsRescheduleAppointmentModalOpen(false);
      form.setValue("date", "");
      form.setValue("time", "");
    }
  };

  const form = useForm<TRequestDateAndTime>({
    resolver: zodResolver(requestDateTimeSchema),
    defaultValues: {
      date: "",
      time: "",
    },
  });

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const firstDayOfWeek = startOfWeek(currentWeek);
  const lastDayOfWeek = endOfWeek(currentWeek);
  const today = new Date();

  const requestedDate = form.watch("date");
  const requestedTime = form.watch("time");

  const daysInWeek = eachDayOfInterval({
    start: firstDayOfWeek,
    end: lastDayOfWeek,
  });

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const isDisabledDay = (day: Date) => {
    return isPast(day) && !isToday(day);
  };

  const isDisabledTime = (timeValue: string) => {
    if (!requestedDate) return false;

    const selectedDate = new Date(requestedDate);

    if (isToday(selectedDate)) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const selectedTime = set(today, { hours, minutes });
      return isPast(selectedTime);
    }

    return false;
  };

  const disablePrevWeek = isSameWeek(today, currentWeek);

  console.log("SCHEDULE: ", form.watch());

  console.log(
    "canRequestReschedule: ",
    canRequestReschedule("January 28, 2025 14:00")
  );

  return (
    <div>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1 className="">
          My <span className="text-primary-700">Appointments</span>
        </H1>
      </header>
      <div className="flex flex-col justify-center w-full">
        <div className="self-center mx-4 my-10 w-[calc(100%-32px)] max-w-[1200px]">
          <div className="flex items-center justify-end mb-6">
            <Button variant="db_default" asChild>
              <Link to="/appointment">
                <span>Book Appointment</span> <FiPlus className="w-4 h-4" />
              </Link>
            </Button>
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
                                    onClick={() =>
                                      navigate(
                                        `/my-appointment/${row.original.id}`
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
                                        `/my-appointment/${row.original.id}`
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
                                        `/my-appointment/${row.original.id}`
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
                                className="flex flex-col w-auto p-0"
                              >
                                <div className="flex flex-col gap-2 px-3 pt-3 pb-2 border-b border-black/10">
                                  {row.original.status !==
                                    APPOINTMENT_STATUS.NO_SHOW.value &&
                                    row.original.status !==
                                      APPOINTMENT_STATUS.CANCELED.value &&
                                    row.original.status !==
                                      APPOINTMENT_STATUS.COMPLETE.value &&
                                    row.original.status !==
                                      APPOINTMENT_STATUS.PENDING.value && (
                                      <>
                                        {/* {!isScheduleInPast(
                                          row.original.schedule
                                        ) ? ( */}
                                        <Dialog
                                          open={isCancelAppointmentModalOpen}
                                          onOpenChange={onOpenChange}
                                        >
                                          {canRequestReschedule(
                                            row.original.schedule
                                          ) ? (
                                            <Button
                                              onClick={onOpenChange}
                                              size="sm"
                                              className="w-full justify-between rounded-[4px] border-red-500 text-red-500 hover:bg-red-500/10"
                                              variant="db_outline"
                                            >
                                              Cancel Appointment
                                            </Button>
                                          ) : (
                                            <HoverCard>
                                              <HoverCardTrigger asChild>
                                                <Button
                                                  onClick={onOpenChange}
                                                  size="sm"
                                                  style={
                                                    !canRequestReschedule(
                                                      row.original.schedule
                                                    )
                                                      ? {
                                                          cursor: "not-allowed",
                                                        }
                                                      : {}
                                                  }
                                                  className={cn(
                                                    "w-full justify-between rounded-[4px] ",
                                                    !canRequestReschedule(
                                                      row.original.schedule
                                                    )
                                                      ? "border-neutral-300 text-neutral-400 bg-neutral-100 hover:bg-neutral-100"
                                                      : "border-red-500 text-red-500 hover:bg-red-500/10"
                                                  )}
                                                  variant="db_outline"
                                                >
                                                  Cancel Appointment
                                                </Button>
                                              </HoverCardTrigger>
                                              <HoverCardContent
                                                side="left"
                                                className="flex flex-col items-center"
                                              >
                                                <h2 className="font-semibold text-red-500/60">
                                                  Heads Up!
                                                </h2>
                                                <p className="text-sm text-neutral-700">
                                                  Cancellation is disabled as
                                                  your appointment is less than
                                                  24 hours away. Please contact
                                                  the clinic for assistance at{" "}
                                                  <a
                                                    href={TOOTH_ABODE_FB_URL}
                                                    className="underline text-primary-700 hover:text-primary-800/90"
                                                  >
                                                    Tooth Abode Dental Clinic
                                                    facebook
                                                  </a>
                                                </p>
                                              </HoverCardContent>
                                            </HoverCard>
                                          )}

                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Cancel Appointment
                                              </DialogTitle>
                                              <DialogDescription>{`Are you sure you want to cancel this appoitment ${formatAppointmentDate(
                                                row.original.schedule
                                              )}`}</DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                              <div className="flex items-center justify-center w-full gap-4 mt-4">
                                                <Button
                                                  variant="db_outline"
                                                  className="w-[30%]"
                                                  onClick={onOpenChange}
                                                >
                                                  No
                                                </Button>
                                                <Button
                                                  variant="db_default"
                                                  className="w-[30%]"
                                                  onClick={() =>
                                                    handleCancelAppointment(
                                                      row.original.id
                                                    )
                                                  }
                                                >
                                                  Yes
                                                </Button>
                                              </div>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                        {/* ) : null} */}

                                        {/* {!isScheduleInPast(
                                          row.original.schedule
                                        ) ? ( */}
                                        <Dialog
                                          open={
                                            isRescheduleAppointmentModalOpen
                                          }
                                          onOpenChange={onOpenRescheduleChange}
                                        >
                                          {canRequestReschedule(
                                            row.original.schedule
                                          ) ? (
                                            <Button
                                              onClick={onOpenRescheduleChange}
                                              size="sm"
                                              className="border-blue-500 bg-blue-50 focus:bg-blue-50 text-blue-500 hover:bg-blue-100 w-full justify-between rounded-[4px] "
                                              variant="db_default"
                                            >
                                              Re-schedule Appointment
                                            </Button>
                                          ) : (
                                            <HoverCard>
                                              <HoverCardTrigger>
                                                <Button
                                                  onClick={
                                                    onOpenRescheduleChange
                                                  }
                                                  size="sm"
                                                  variant="db_default"
                                                  style={{
                                                    cursor: "not-allowed",
                                                  }}
                                                  className={cn(
                                                    " w-full justify-between rounded-[4px] ",
                                                    !canRequestReschedule(
                                                      row.original.schedule
                                                    )
                                                      ? "border-neutral-300 focus:bg-neutral-100 text-neutral-400 bg-neutral-100 hover:bg-neutral-100"
                                                      : "border-blue-500 text-blue-500 hover:bg-blue-100"
                                                  )}
                                                >
                                                  Re-schedule Appointment
                                                </Button>
                                              </HoverCardTrigger>
                                              <HoverCardContent
                                                side="left"
                                                className="flex flex-col items-center"
                                              >
                                                <h2 className="font-semibold text-red-500/60">
                                                  Heads Up!
                                                </h2>
                                                <p className="text-sm text-neutral-700">
                                                  Rescheduling is disabled as
                                                  your appointment is less than
                                                  24 hours away. Please contact
                                                  the clinic for assistance at{" "}
                                                  <a
                                                    href={TOOTH_ABODE_FB_URL}
                                                    className="underline text-primary-700 hover:text-primary-800/90"
                                                  >
                                                    Tooth Abode Dental Clinic
                                                    facebook
                                                  </a>
                                                </p>
                                              </HoverCardContent>
                                            </HoverCard>
                                          )}

                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Request Re-schedule Appointment
                                              </DialogTitle>
                                              <DialogDescription>{`Are you sure you want to re-schedule this appoitment ${formatAppointmentDate(
                                                row.original.schedule
                                              )}`}</DialogDescription>
                                            </DialogHeader>

                                            <div>
                                              <div className="container p-4 mx-auto border border-neutral-200 rounded-[8px]">
                                                <div className="flex justify-between w-full mb-4">
                                                  <button
                                                    onClick={handlePrevWeek}
                                                    type="button"
                                                    disabled={disablePrevWeek}
                                                    className={cn(
                                                      disablePrevWeek
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                    )}
                                                  >
                                                    <MdPlayArrow className="w-5 h-5 rotate-180 text-neutral-600" />
                                                  </button>

                                                  <h2 className="font-semibold text-center text-neutral-800">
                                                    {format(
                                                      lastDayOfWeek,
                                                      "MMMM yyyy"
                                                    )}
                                                  </h2>

                                                  <button
                                                    type="button"
                                                    onClick={handleNextWeek}
                                                  >
                                                    <MdPlayArrow className="w-5 h-5 text-neutral-600" />
                                                  </button>
                                                </div>
                                                <div className="grid grid-cols-7 gap-2">
                                                  {daysInWeek.map(
                                                    (day, index) => (
                                                      <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => {
                                                          const formattedDay =
                                                            formatDate(
                                                              day + ""
                                                            );
                                                          console.log(
                                                            "formattedDay: ",
                                                            formattedDay
                                                          );
                                                          form.setValue(
                                                            "date",
                                                            formattedDay
                                                          );
                                                        }}
                                                        disabled={isDisabledDay(
                                                          day
                                                        )}
                                                        className={cn(
                                                          "border rounded-md p-2 text-center cursor-pointer",
                                                          isSameDay(
                                                            form.watch("date"),
                                                            day
                                                          )
                                                            ? "bg-primary-100  outline outline-2 outline-primary-600 text-primary-900"
                                                            : "",
                                                          isDisabledDay(day)
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                        )}
                                                      >
                                                        {format(day, "d")}
                                                      </button>
                                                    )
                                                  )}
                                                  {form.formState.errors
                                                    .date && (
                                                    <span className="text-sm text-destructive">
                                                      {
                                                        form.formState.errors
                                                          .date.message
                                                      }
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="mt-10">
                                                <p className="text-neutral-500 text-[11px]">
                                                  All times are in Asia/Manila
                                                  (UTC+08)
                                                </p>
                                                <div className="grid grid-cols-4 gap-4 mt-3">
                                                  {TIME_LIST.map(
                                                    ({ value, label }) => (
                                                      <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() =>
                                                          form.setValue(
                                                            "time",
                                                            value
                                                          )
                                                        }
                                                        disabled={isDisabledTime(
                                                          value
                                                        )}
                                                        className={cn(
                                                          "rounded-[8px] px-3 py-2",
                                                          requestedTime ===
                                                            value
                                                            ? "bg-primary-100 outline outline-primary-600 outline-2 text-primary-900"
                                                            : "bg-neutral-200 text-neutral-800",
                                                          isDisabledTime(value)
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                        )}
                                                      >
                                                        <p className="text-center font-medium text-[13px]">
                                                          {label}
                                                        </p>
                                                      </button>
                                                    )
                                                  )}
                                                  {form.formState.errors
                                                    .time && (
                                                    <span className="text-sm text-destructive">
                                                      {
                                                        form.formState.errors
                                                          .time.message
                                                      }
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <div className="flex items-center justify-center w-full gap-4 mt-4">
                                                <Button
                                                  variant="db_outline"
                                                  className="w-[30%]"
                                                  onClick={
                                                    onOpenRescheduleChange
                                                  }
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="db_default"
                                                  className="w-[30%]"
                                                  onClick={() =>
                                                    handleRequestRescheduleAppointment(
                                                      row.original.id
                                                    )
                                                  }
                                                >
                                                  Submit
                                                </Button>
                                              </div>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                        {/* ) : null} */}
                                      </>
                                    )}
                                  <Button
                                    size="sm"
                                    className=" w-full min-w-[100px] justify-between rounded-[4px] hover:bg-primary-400/20"
                                    variant="db_outline"
                                    onClick={() =>
                                      navigate(
                                        `/my-appointment/${row.original.id}`
                                      )
                                    }
                                  >
                                    <span>View</span>
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
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
