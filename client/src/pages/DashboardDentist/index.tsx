import useAuth from "@/hooks/useAuth";
import { createUsername } from "@/lib/utils";
import {
  useGetDentistAppointments,
  useGetPatientsOfDoctor,
  useGetUser,
} from "@/service/queries";
import { TMyAppointment, TPatientInfo, TUser } from "@/types/types";
import dentalVector from "@/assets/dentalvector.png";
import { Badge } from "@/components/ui/badge";
import { MdPendingActions } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { useMemo } from "react";
import { GrGroup } from "react-icons/gr";
import { Link } from "react-router-dom";

const DashboardDentist = () => {
  const { userId } = useAuth();
  const { data, error, isLoading } = useGetUser(userId!);
  const user: TUser = !isLoading ? data.data : null;
  const { data: appointmentInfo, isLoading: isAppointmentLoading } =
    useGetDentistAppointments(userId!);

  const appointment: TMyAppointment[] = !isAppointmentLoading
    ? appointmentInfo.data
    : null;

  const { data: allPatientInfo, isLoading: isPatientLoading } =
    useGetPatientsOfDoctor(userId);

  const allPatient: TPatientInfo[] = useMemo(
    () => allPatientInfo?.data || [],
    [allPatientInfo]
  );

  if (isLoading || isAppointmentLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  console.log("DashboardDentist user", user);
  console.log("DashboardDentist appointment", appointment);

  // Get today's date as a string (e.g., "2025-01-12")
  const today = new Date().toISOString().slice(0, 10);

  // Filter appointments for today
  const todayAppointments = appointment?.filter((appt) => {
    const appointmentDate = new Date(appt.schedule);
    const appointmentDateString = appointmentDate.toISOString().slice(0, 10);
    return appointmentDateString === today;
  });

  // Filter today's appointments with a status of "pending"
  const pendingTodayAppointments = appointment?.filter(
    (appt) => appt.status === "pending"
  );

  // Sort pending appointments by time
  const sortedPendingAppointments = pendingTodayAppointments?.sort((a, b) => {
    const timeA = new Date(a.schedule).getTime();
    const timeB = new Date(b.schedule).getTime();
    return timeA - timeB; // Ascending order
  });

  // Determine the greeting based on the current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div>
      <div className="grid grid-cols-[4fr,1fr,1fr] gap-4">
        <div className="flex items-center justify-between pl-4 pr-0 border rounded-lg text-primary-950 bg-primary-100 border-primary-200 shadow-mui-shadow-1">
          <div>
            <p className="text-sm font-medium capitalize">{greeting},</p>
            <h1
              className="font-semibold my-1
             text-[24px]"
            >{`Dr. ${createUsername({
              firstname: user.firstName,
              middlename: user.middleName || "",
              lastname: user.lastName,
            })}`}</h1>
            <p className="text-base font-medium">
              You have{" "}
              <Link to="/dentist/my_appointments/pending_appointment">
                <Badge className="font-normal text-white bg-green-500 hover:bg-green-800">
                  {sortedPendingAppointments.length} pending appointments
                </Badge>{" "}
              </Link>
              today.
            </p>
          </div>
          <img className=" w-[280px]" src={dentalVector} alt="" />
        </div>

        <Link
          to="/dentist/my_appointments/pending_appointment"
          className="flex flex-col items-center justify-start gap-2 pt-4 border rounded-lg hover:bg-primary-50 border-neutral-200/80 shadow-mui-shadow-2"
        >
          <div className="p-4 rounded-full bg-primary-600/20">
            <MdPendingActions className="text-primary-700 w-7 h-7 " />
          </div>
          <h2 className="text-[30px] font-semibold text-primary-700">
            {pendingTodayAppointments.length}
          </h2>{" "}
          <h3 className="text-xs font-medium text-center">
            Pending Approval Appointments
          </h3>
        </Link>
        <Link
          to="/dentist/my_patients"
          className="flex flex-col items-center justify-start gap-2 pt-4 border rounded-lg hover:bg-blue-50 border-neutral-200/80 shadow-mui-shadow-2"
        >
          <div className="p-4 bg-blue-200 rounded-full">
            <GrGroup className="text-blue-800 w-7 h-7 " />
          </div>
          <h2 className="text-[30px] font-semibold text-blue-800">
            {allPatient.length}
          </h2>
          <h3 className="text-xs font-medium text-center">Total Patients</h3>
        </Link>
      </div>
    </div>
  );
};

export default DashboardDentist;
