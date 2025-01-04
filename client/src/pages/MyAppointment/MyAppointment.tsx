import { Link, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { TbDental } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";

import H1 from "@/components/ui/H1";
import useAuth from "@/hooks/useAuth";
import { useGetMyAppointment } from "@/service/queries";
import { TCancelAppointment, TMyAppointment } from "@/types/types";
import { APPOINTMENT_STATUS } from "@/lib/variables";
import { createUsername, formatAppointmentDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCancelAppointment } from "@/service/mutation";

type AppointmentStatusKey = keyof typeof APPOINTMENT_STATUS;

const getStatusConfig = (
  status: string
): (typeof APPOINTMENT_STATUS)[AppointmentStatusKey] | null => {
  const upperStatus = status.toUpperCase() as AppointmentStatusKey;
  return APPOINTMENT_STATUS[upperStatus] || null;
};

const MyAppointment = () => {
  const cancelAppointment = useCancelAppointment();
  const [isCancelAppointmentModalOpen, setIsCancelAppointmentModalOpen] =
    useState(false);

  const { userId } = useAuth();
  const { id } = useParams();
  const { data: myAppointmentData, isLoading } = useGetMyAppointment(
    userId!,
    id!
  );
  const myAppointment: TMyAppointment | undefined = myAppointmentData?.data;

  const statusConfig = myAppointment
    ? getStatusConfig(myAppointment.status)
    : null;
  const onOpenChange = () => {
    setIsCancelAppointmentModalOpen((prev) => !prev);
  };

  const handleCancelAppointment = async () => {
    if (myAppointment) {
      cancelAppointment.mutate({ id: myAppointment.id });
      setIsCancelAppointmentModalOpen(false);
    }
  };

  console.log("myAppointment: ", myAppointment);

  return (
    <div>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1 className="">
          My <span className="text-primary-700">Appointment</span>
        </H1>
      </header>

      <div>
        {!isLoading && myAppointment && (
          <div className="mx-4 my-8">
            <div className="flex items-center gap-2">
              <FaCheckCircle
                className="w-6 h-6"
                style={{
                  color: statusConfig?.foreGround,
                }}
              />
              <h1
                className="text-[24px] font-bold"
                style={{
                  color: statusConfig?.foreGround,
                }}
              >
                {statusConfig?.title}
              </h1>
            </div>

            <div>
              <div>
                <p
                  className="py-4 mt-2 text-sm text-center rounded-sm"
                  style={{
                    color: statusConfig?.foreGround,
                    backgroundColor: statusConfig?.backGround,
                  }}
                >
                  {statusConfig?.message}
                </p>
              </div>
              <Separator className="mt-6" />
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-500/90">
                    Location:{" "}
                  </span>
                  <div className="flex items-center gap-2 mt-1 group">
                    <FaLocationDot className="group-hover:text-primary-700" />

                    <Link
                      to="https://www.google.com/maps/dir/14.5948672,120.9991168/14.6168975,120.9706318/@14.6054999,120.9652494,14z/data=!3m1!4b1!4m4!4m3!1m1!4e1!1m0!5m1!1e1?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                      className="mt-[2px] font-semibold capitalize underline group-hover:text-primary-700 rounded-md text-neutral-700"
                    >
                      Juan Luna St 1806, Manila, Philippines
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-500/90">
                    Requested Date & Time:{" "}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <MdDateRange />

                    <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                      {formatAppointmentDate(myAppointment.schedule)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-500/90">
                    Booked for:{" "}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <IoPersonCircleOutline className="w-5 h-5" />
                    <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                      {createUsername({
                        firstname: myAppointment.patientFirstName,
                        middlename: myAppointment.patientMiddleName,
                        lastname: myAppointment.patientLastName,
                      })}
                      {myAppointment.patientSuffix ? (
                        <span>{myAppointment.patientSuffix}</span>
                      ) : null}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-500/90">
                    Dentist:{" "}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <IoPersonCircleOutline className="w-5 h-5" />
                    <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                      {`Dr ${createUsername({
                        firstname: myAppointment.dentistFirstName,
                        middlename: myAppointment.dentistMiddleName,
                        lastname: myAppointment.dentistLastName,
                      })} ${
                        myAppointment.dentistSuffix
                          ? myAppointment.dentistSuffix
                          : ""
                      }`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-500/90">
                    Dental service:
                  </span>
                  <div className="flex flex-col items-center justify-start gap-1 mt-1">
                    {myAppointment.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center self-start gap-1"
                      >
                        <TbDental className="w-5 h-5" />

                        <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-neutral-500/90">
                    Status:
                  </span>
                  <span
                    className="px-2 py-1 mt-1 text-sm font-semibold capitalize rounded-md"
                    style={{
                      color: statusConfig?.foreGround,
                      backgroundColor: statusConfig?.backGround,
                    }}
                  >
                    {statusConfig?.label}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-10">
                {myAppointment.status !== "canceled" &&
                  myAppointment.status !== "no_show" && (
                    <Dialog
                      open={isCancelAppointmentModalOpen}
                      onOpenChange={onOpenChange}
                    >
                      <Button onClick={onOpenChange} variant="outline">
                        Cancel Appointment
                      </Button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Appointment</DialogTitle>
                          <DialogDescription>{`Are you sure you want to cancel this appoitment ${formatAppointmentDate(
                            myAppointment.schedule
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
                              onClick={handleCancelAppointment}
                              // className="rounded-md"
                              // onClick={() =>
                              //   handleDeleteAllDentist({ ids: selectedDentistRow })
                              // }
                            >
                              Yes
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                <Button asChild>
                  <Link to="/appointment">Book another appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
