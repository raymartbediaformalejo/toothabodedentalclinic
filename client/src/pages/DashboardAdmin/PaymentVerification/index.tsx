import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
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
import { useGetAllPaymentVerification } from "@/service/queries";
import {
  TApproveAppointment,
  TPaymentVerification,
  TRejectAppointment,
} from "@/types/types";
import {
  useApproveAppointment,
  useRejectAppointment,
} from "@/service/mutation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/customCheckbox";
import { LuArrowUp } from "react-icons/lu";
import {
  cn,
  createUsername,
  formatAppointmentDate,
  formatReadableDate,
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
import UserName from "@/pages/DashboardDentist/Appointment/components/UserName";
import Services from "@/pages/MyAppointment/components/Services";
import AppointmentStatus from "@/pages/MyAppointment/components/AppointmentStatus";
import PaymentVerificationStatus from "./components/PaymentVerificationStatus";
import Schedule from "./components/Schedule";

const columnAppointments = [
  {
    header: "User",
    accessorKey: "userId",
  },
  {
    header: "No-show Appointment",
    accessorKey: "appointmentIds",
  },
  {
    header: "Payment Status",
    accessorKey: "status",
  },
  {
    header: "Created at",
    accessorKey: "createdAt",
  },
];

const PaymentVerification = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const approveAppointment = useApproveAppointment();
  const rejectAppoinment = useRejectAppointment();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [rowPerPage, setRowPerPage] = useState(6);
  const { data, isLoading } = useGetAllPaymentVerification();
  const allPaymentVerification: TPaymentVerification[] = useMemo(
    () => data?.data || [],
    [data]
  );
  const table = useReactTable({
    data: allPaymentVerification,
    columns: columnAppointments,
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

  const selectedAppointmentRow = Object.keys(table.getState().rowSelection);

  useEffect(() => {
    table.setPageSize(rowPerPage);
  }, [rowPerPage, table]);

  const handleRowPerPageChange = (value: number) => {
    setRowPerPage(value);
  };

  const handleApproveAppointment = async (data: TApproveAppointment) => {
    try {
      if (data.appointmentId) {
        await approveAppointment.mutate(data);
        setIsApprovedModalOpen(false);
      }
    } catch (error) {
      console.log("Error approve appointment: ", error);
    }
  };
  const handleRejectAppointment = async (data: TRejectAppointment) => {
    try {
      if (data.appointmentId) {
        await rejectAppoinment.mutate(data);
        setIsDeclineModalOpen(false);
      }
    } catch (error) {
      console.log("Error approve appointment: ", error);
    }
  };

  const onOpenApprovedModalChange = () => {
    setIsApprovedModalOpen((prev) => !prev);
  };
  const onOpenDeclineModalChange = () => {
    setIsDeclineModalOpen((prev) => !prev);
  };

  console.log("allPaymentVerification: ", allPaymentVerification);

  return (
    <>
      <div className="flex items-center justify-between mb-6 ">
        <header className=" text-black/80">
          <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
            All Payment Verifications
          </h1>
        </header>
      </div>

      {/* =========== START TABLE ============= */}
      <Card className="bg-white shadow-sidebar-shadow overflow-hidden border-[rgba(46,32,0,0.1)]">
        {allPaymentVerification.length === 0 && !isLoading && (
          <div className="w-full flex items-center justify-center  py-6 h-[200px]">
            <p className="w-full italic text-center text-black/70 ">
              There are no records to display for Appointments
            </p>
          </div>
        )}
        {allPaymentVerification.length > 0 && (
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
                          {header.id === "userId" && (
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

                          {header.id !== "userId" && (
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
                      isSelected={selectedAppointmentRow.includes(
                        row.original.id
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <React.Fragment key={cell.id}>
                            {cell.column.id === "userId" ? (
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
                                  to={`/admin/payment-verification/${row.original.id}`}
                                >
                                  <UserName userId={cell.row.original.userId} />
                                </Link>
                              </TableCell>
                            ) : cell.column.id === "appointmentIds" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <div>
                                  {row.original.appointmentIds.map(
                                    (appointmentId) => (
                                      <div>
                                        <Schedule
                                          appointmentId={appointmentId}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </TableCell>
                            ) : cell.column.id === "status" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <PaymentVerificationStatus
                                  status={row.original.status}
                                />
                              </TableCell>
                            ) : cell.column.id === "createdAt" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <span className="text-nowrap">
                                  {formatReadableDate(
                                    cell.row.original.createdAt
                                  )}
                                </span>
                              </TableCell>
                            ) : cell.column.id === "createdBy" ? (
                              <TableCell
                                key={cell.id}
                                className=" text-[#424242] text-sm"
                              >
                                <UserName
                                  userId={cell.row.original.createdBy}
                                />
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
                            {row.original.status === "pending" ? (
                              <div className="pb-1 border-b border-black/10">
                                <div className="flex flex-col w-full gap-2 px-3 pt-3 pb-2">
                                  <Dialog
                                    open={isApprovedModalOpen}
                                    onOpenChange={onOpenApprovedModalChange}
                                  >
                                    <Button
                                      size="sm"
                                      className="w-full  border-green-500 text-green-800 justify-between rounded-[4px] hover:bg-green-200 focus:bg-green-200 "
                                      variant="db_outline"
                                      onClick={onOpenApprovedModalChange}
                                    >
                                      <span>Approve</span>
                                    </Button>
                                    <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                                      <DialogHeader className="px-6 pt-8">
                                        <DialogTitle className="text-2xl font-bold text-center">
                                          Approve Appointment
                                        </DialogTitle>
                                        <DialogDescription className="text-center text-neutral-600">
                                          Are you sure you want to approve this
                                          appointment?
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter className="px-6 py-4 bg-gray-100">
                                        <div className="flex items-center justify-center w-full gap-4">
                                          <Button
                                            className="rounded-md"
                                            variant="db_outline"
                                            onClick={onOpenApprovedModalChange}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="db_default"
                                            onClick={() =>
                                              handleApproveAppointment({
                                                appointmentId: row.original.id,
                                              })
                                            }
                                            className="text-green-800 bg-green-200 border border-green-500 rounded-md focus:bg-green-500/30 hover:bg-green-500/30"
                                          >
                                            Approve
                                          </Button>
                                        </div>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Dialog
                                    open={isDeclineModalOpen}
                                    onOpenChange={onOpenDeclineModalChange}
                                  >
                                    <Button
                                      size="sm"
                                      className="w-full  border-red-500 text-red-800 justify-between rounded-[4px] hover:bg-red-100 focus:bg-red-100 "
                                      variant="db_outline"
                                      onClick={onOpenDeclineModalChange}
                                    >
                                      <span>Reject</span>
                                    </Button>
                                    <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                                      <DialogHeader className="px-6 pt-8">
                                        <DialogTitle className="text-2xl font-bold text-center">
                                          Reject Appointment
                                        </DialogTitle>
                                        <DialogDescription className="text-center text-neutral-600">
                                          Are you sure you want to do reject
                                          this appointment?{" "}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter className="px-6 py-4 bg-gray-100">
                                        <div className="flex items-center justify-center w-full gap-4">
                                          <Button
                                            className="rounded-md"
                                            variant="db_outline"
                                            onClick={onOpenDeclineModalChange}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="db_default"
                                            className="text-red-800 bg-red-100 border border-red-500 rounded-md focus:bg-red-500/30 hover:bg-red-500/30"
                                            onClick={() =>
                                              handleRejectAppointment({
                                                appointmentId: row.original.id,
                                              })
                                            }
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            ) : null}
                            <div className="w-full px-3 pt-2 pb-2">
                              <Button
                                size="sm"
                                className="w-full justify-between rounded-[4px] hover:bg-primary-400/20"
                                variant="db_outline"
                                onClick={() =>
                                  navigate(
                                    `/admin/appointments/${row.original.id}`
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
      {!!allPaymentVerification.length && (
        <div className="flex justify-between my-8 text-sm ">
          <p
            className={cn(
              "flex transition-colors duration-100 ease-in-out place-items-center font-inter ",
              selectedAppointmentRow.length ? "text-black" : "text-black/60"
            )}
          >
            {`${selectedAppointmentRow.length} of ${allPaymentVerification.length} row(s) selected.`}
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

export default PaymentVerification;
