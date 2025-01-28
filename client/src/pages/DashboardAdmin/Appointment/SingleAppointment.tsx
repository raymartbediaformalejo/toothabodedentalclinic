import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetMyAppointment } from "@/service/queries";
import {
  TApproveAppointment,
  TMyAppointment,
  TRejectAppointment,
} from "@/types/types";
import PatientProfile from "@/pages/DashboardDentist/Appointment/components/PatientProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createUsername,
  formatAppointmentDate,
  formatReadableDate,
} from "@/lib/utils";
import BookedBy from "@/pages/DashboardDentist/Appointment/components/BookedBy";
import BookedFor from "@/pages/DashboardDentist/Appointment/components/BookedFor";
import MedicalHistory from "@/pages/DashboardDentist/Appointment/components/MedicalHistory";
import {
  useApproveRequestReschedAppointment,
  useMarkAsCanceledAppointment,
  useMarkAsCompletedAppointment,
  useMarkAsNoShowAppointment,
  useRejectAppointment,
} from "@/service/mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentStatus from "@/pages/MyAppointment/components/AppointmentStatus";
import { APPOINTMENT_STATUS } from "@/lib/variables";

const AdminSingleAppointment = () => {
  const navigate = useNavigate();
  const { id: appointmentId } = useParams();
  const [isMarkAsCompletedModalOpen, setIsMarkAsCompletedModalOpen] =
    useState(false);
  const [isMarkAsCanceledModalOpen, setIsMarkAsCanceledModalOpen] =
    useState(false);
  const [isMarkAsNoShowModalOpen, setIsMarkAsNoShowModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const { data: appointmentData, isLoading: isLoadingAppointment } =
    useGetMyAppointment(appointmentId!);

  const markAsCompleted = useMarkAsCompletedAppointment();
  const markAsCanceled = useMarkAsCanceledAppointment();
  const markAsNoShow = useMarkAsNoShowAppointment();

  const approveRequestReschedAppointment =
    useApproveRequestReschedAppointment();

  const rejectAppoinment = useRejectAppointment();

  const appointment: TMyAppointment = useMemo(
    () => appointmentData?.data || [],
    [appointmentData]
  );

  console.log("AdminSingleAppointment: ", appointment);

  if (isLoadingAppointment) {
    return <div>Loading...</div>;
  }
  const handleMarkAsCompletedAppointment = async (
    data: TApproveAppointment
  ) => {
    try {
      if (data.appointmentId) {
        await markAsCompleted.mutate(data);
        setIsMarkAsCompletedModalOpen(false);
        navigate("/admin/appointments");
      }
    } catch (error) {
      console.log("Error mark as completed appointment: ", error);
    }
  };
  const handleMarkAsCanceledAppointment = async (data: TApproveAppointment) => {
    try {
      if (data.appointmentId) {
        await markAsCanceled.mutate(data);
        setIsMarkAsCanceledModalOpen(false);
        navigate("/admin/appointments");
      }
    } catch (error) {
      console.log("Error mark as canceled appointment: ", error);
    }
  };
  const handleMarkAsNoShowAppointment = async (data: TApproveAppointment) => {
    try {
      if (data.appointmentId) {
        await markAsNoShow.mutate(data);
        setIsMarkAsNoShowModalOpen(false);
        navigate("/admin/appointments");
      }
    } catch (error) {
      console.log("Error mark as no-show appointment: ", error);
    }
  };
  const handleApproveAppointment = async (data: TApproveAppointment) => {
    try {
      if (data.appointmentId) {
        await approveRequestReschedAppointment.mutate(data);
        setIsApprovedModalOpen(false);
        navigate("/admin/appointments");
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
        navigate("/admin/appointments");
      }
    } catch (error) {
      console.log("Error approve appointment: ", error);
    }
  };
  const onOpenMarkAsCompletedModalChange = () => {
    setIsMarkAsCompletedModalOpen((prev) => !prev);
  };

  const onOpenMarkAsCanceledModalChange = () => {
    setIsMarkAsCanceledModalOpen((prev) => !prev);
  };

  const onOpenMarkAsNoShowModalChange = () => {
    setIsMarkAsNoShowModalOpen((prev) => !prev);
  };

  const onOpenApprovedModalChange = () => {
    setIsApprovedModalOpen((prev) => !prev);
  };

  const onOpenDeclineModalChange = () => {
    setIsDeclineModalOpen((prev) => !prev);
  };

  console.log("appointment: ", appointment);

  return (
    <div className=" max-w-[1200px] mx-auto mb-12">
      <header className=" text-black/80">
        <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
          Appointment Details
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card className="w-[35%]">
          <CardHeader>
            <p>Patient's Profile</p>
          </CardHeader>
          <PatientProfile patientId={appointment.appointmentPatientInfoId} />
        </Card>
        <Card className="w-[70%]">
          <Tabs defaultValue="appointment_details">
            <CardHeader className="flex flex-row justify-between items-center  py-[13px]">
              <TabsList>
                <TabsTrigger value="appointment_details">
                  Appointment details
                </TabsTrigger>
                <TabsTrigger value="medical_history">
                  Medical history
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3 m-0">
                <p className="text-sm text-neutral-500/90">Status:</p>
                <div className="pb-2">
                  <AppointmentStatus status={appointment.status} />
                </div>
              </div>
            </CardHeader>

            <TabsContent value="appointment_details">
              <CardContent className="max-w-[500px] w-full flex flex-col gap-4">
                <div className="grid items-center grid-cols-2">
                  <span className="text-sm text-neutral-500/90">Dentist:</span>
                  <span className="break-words text-neutral-800">
                    {createUsername({
                      firstname: appointment.dentistFirstName,
                      middlename: appointment.dentistMiddleName || "",
                      lastname: appointment.dentistLastName,
                    })}
                  </span>
                </div>
                <div className="grid items-center grid-cols-2">
                  <span className="text-sm text-neutral-500/90">
                    Booked for:
                  </span>
                  <span className=" text-neutral-800">
                    {/* <BookedBy */}
                    <BookedFor userId={appointment.appointmentPatientInfoId} />
                  </span>
                </div>
                <div className="grid items-center grid-cols-2">
                  <span className="text-sm text-neutral-500/90">
                    Requested date & time:
                  </span>
                  <span className=" text-neutral-800">
                    {formatAppointmentDate(appointment.schedule)}
                  </span>
                </div>
                <div className="grid items-center grid-cols-2">
                  <span className="text-sm text-neutral-500/90">
                    Booked by:
                  </span>
                  <span className="break-words text-neutral-800">
                    <BookedBy userId={appointment.createdBy} />
                  </span>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="medical_history">
              <CardContent className="flex flex-col w-full gap-6 pt-2 ">
                <MedicalHistory id={appointment.medicalHistoryId} />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {appointment.status === APPOINTMENT_STATUS.APPROVED.value && (
        <div className="flex justify-center w-full">
          <div className="flex w-full mb-10 mt-6 max-w-[500px] gap-2 px-3 pt-3 pb-2">
            <Dialog
              open={isMarkAsCanceledModalOpen}
              onOpenChange={onOpenMarkAsCanceledModalChange}
            >
              <Button
                variant="db_outline"
                className="w-full text-neutral-500  border border-neutral-300  focus:bg-neutral-300/30 hover:bg-neutral-300/30 justify-center bg-neutral-100 rounded-[4px] "
                onClick={onOpenMarkAsCanceledModalChange}
              >
                Mark as canceled
              </Button>
              <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                <DialogHeader className="px-6 pt-8">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Mark as Canceled this Appointment
                  </DialogTitle>
                  <DialogDescription className="text-center text-neutral-600">
                    Are you sure you want to marks as "
                    <span className="text-[#737373] font-semibold">
                      canceled
                    </span>
                    " this appointment?{" "}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-gray-100">
                  <div className="flex items-center justify-center w-full gap-4">
                    <Button
                      className="rounded-md"
                      variant="db_outline"
                      onClick={onOpenMarkAsCanceledModalChange}
                    >
                      No
                    </Button>
                    <Button
                      variant="db_default"
                      className="text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-md focus:bg-neutral-200/30 hover:bg-neutral-200/30"
                      onClick={() =>
                        handleMarkAsCanceledAppointment({
                          appointmentId: appointment.id,
                        })
                      }
                    >
                      Yes
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isMarkAsNoShowModalOpen}
              onOpenChange={onOpenMarkAsNoShowModalChange}
            >
              <Button
                variant="db_outline"
                className="w-full text-[#EF4444]  border border-[#EF4444]/50  focus:bg-[#EF4444]/20 hover:bg-[#EF4444]/20 justify-center bg-[#FEF2F2] rounded-[4px]"
                onClick={onOpenMarkAsNoShowModalChange}
              >
                Mark as no-show
              </Button>
              <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                <DialogHeader className="px-6 pt-8">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Mark as No-show this Appointment
                  </DialogTitle>
                  <DialogDescription className="text-center text-neutral-600">
                    Are you sure you want to marks as "
                    <span className="text-[#EF4444] font-semibold">
                      no-show
                    </span>
                    " this appointment?{" "}
                    <p>
                      Upon marking this no-show, the account associated to this
                      will be "
                      <span className="text-red-500 font-semibold">
                        restricted
                      </span>
                      " .
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-gray-100">
                  <div className="flex items-center justify-center w-full gap-4">
                    <Button
                      className="rounded-md"
                      variant="db_outline"
                      onClick={onOpenMarkAsNoShowModalChange}
                    >
                      No
                    </Button>
                    <Button
                      variant="db_default"
                      className="text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-md focus:bg-neutral-200/30 hover:bg-neutral-200/30"
                      onClick={() =>
                        handleMarkAsNoShowAppointment({
                          appointmentId: appointment.id,
                        })
                      }
                    >
                      Yes
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isMarkAsCompletedModalOpen}
              onOpenChange={onOpenMarkAsCompletedModalChange}
            >
              <Button
                variant="db_outline"
                className="w-full text-[#6366F1]  border border-[#6366F1]/40  focus:bg-[#6366F1]/20 hover:bg-[#6366F1]/20 justify-center bg-[#EEF2FF] rounded-[4px]"
                onClick={onOpenMarkAsCompletedModalChange}
              >
                Mark as completed
              </Button>
              <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                <DialogHeader className="px-6 pt-8">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Mark as Completed this Appointment
                  </DialogTitle>
                  <DialogDescription className="text-center text-neutral-600">
                    Are you sure you want to marks as "
                    <span className="text-[#6366F1] font-semibold">
                      completed
                    </span>
                    " this appointment?{" "}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-gray-100">
                  <div className="flex items-center justify-center w-full gap-4">
                    <Button
                      className="rounded-md"
                      variant="db_outline"
                      onClick={onOpenMarkAsCompletedModalChange}
                    >
                      No
                    </Button>
                    <Button
                      variant="db_default"
                      className="text-green-600 bg-green-200 border border-green-500/60 rounded-md focus:bg-green-500/30 hover:bg-green-500/30"
                      onClick={() =>
                        handleMarkAsCompletedAppointment({
                          appointmentId: appointment.id,
                        })
                      }
                    >
                      Yes
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {appointment.status === APPOINTMENT_STATUS.PENDING.value && (
        <div className="flex justify-center w-full">
          <div className="flex w-full mb-10 mt-6 max-w-[500px] gap-2 px-3 pt-3 pb-2">
            <Dialog
              open={isDeclineModalOpen}
              onOpenChange={onOpenDeclineModalChange}
            >
              <Button
                size="sm"
                className="w-full  border-red-500 text-red-800 justify-center bg-red-50/50 rounded-[4px] hover:bg-red-100 focus:bg-red-100 "
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
                    Are you sure you want to do reject this appointment?{" "}
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
                          appointmentId: appointment.id,
                        })
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isApprovedModalOpen}
              onOpenChange={onOpenApprovedModalChange}
            >
              <Button
                size="sm"
                className="w-full  border-green-500 bg-green-200/50 text-green-800 justify-center items-center rounded-[4px] hover:bg-green-200 focus:bg-green-200 "
                variant="db_outline"
                onClick={onOpenApprovedModalChange}
              >
                <span className="text-center">Approve</span>
              </Button>
              <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                <DialogHeader className="px-6 pt-8">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Approve Appointment
                  </DialogTitle>
                  <DialogDescription className="text-center text-neutral-600">
                    Are you sure you want to approve this appointment?
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
                          appointmentId: appointment.id,
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
          </div>
        </div>
      )}

      {appointment.status ===
        APPOINTMENT_STATUS.REQUESTING_RE_SCHEDULE.value && (
        <div className="flex justify-center w-full">
          <div className="flex w-full mb-10 mt-6 max-w-[500px] gap-2 px-3 pt-3 pb-2">
            <Dialog
              open={isDeclineModalOpen}
              onOpenChange={onOpenDeclineModalChange}
            >
              <Button
                size="sm"
                className="w-full  border-red-500 text-red-800 justify-center bg-red-50/50 rounded-[4px] hover:bg-red-100 focus:bg-red-100 "
                variant="db_outline"
                onClick={onOpenDeclineModalChange}
              >
                Reject Request Re-schedule
              </Button>
              <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                <DialogHeader className="px-6 pt-8">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Reject Appointment
                  </DialogTitle>
                  <DialogDescription className="text-center text-neutral-600">
                    Are you sure you want to do reject this appointment?{" "}
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
                          appointmentId: appointment.id,
                        })
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isApprovedModalOpen}
              onOpenChange={onOpenApprovedModalChange}
            >
              <Button
                size="sm"
                className="w-full  border-green-500 bg-green-200/50 text-green-800 justify-center items-center rounded-[4px] hover:bg-green-200 focus:bg-green-200 "
                variant="db_outline"
                onClick={onOpenApprovedModalChange}
              >
                <span className="text-center">Approve Request Re-schedule</span>
              </Button>
              <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
                <DialogHeader className="px-6 pt-8">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Approve Request Re-schedule of Appointment
                  </DialogTitle>
                  <DialogDescription className="text-center text-neutral-600">
                    Are you sure you want to approve this request for
                    re-scheduling of appointment{" "}
                    <span className="font-semibold text-primary-700">
                      {formatReadableDate(appointment.schedule)}
                    </span>
                    ?
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
                          appointmentId: appointment.id,
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSingleAppointment;
