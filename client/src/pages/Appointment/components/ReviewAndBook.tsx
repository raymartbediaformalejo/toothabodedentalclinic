import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  createUsername,
  formatAppointmentDate,
  formatDate,
  formatTimeTo12Hour,
} from "@/lib/utils";
import { useGetDentist, useGetServicesById } from "@/service/queries";
import {
  TAppointmentInfo,
  TDentist,
  TPatientInfo,
  TRequestDateAndTime,
  TService,
} from "@/types/types";
import { useFormContext } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import ReviewAndBookService from "./ReviewAndBookService";

const ReviewAndBook = () => {
  const { watch } = useFormContext<
    TAppointmentInfo | TRequestDateAndTime | TPatientInfo
  >();
  const dentistId = watch("dentistId");
  const serviceIds = watch("serviceIds");
  const date = watch("date");
  const time = watch("time");
  const firstName = watch("firstName");
  const middleName = watch("middleName");
  const lastName = watch("lastName");
  const birthday = watch("birthDay");
  const age = watch("age");
  const religion = watch("religion");
  const nationality = watch("nationality");
  const email = watch("email");
  const mobileNo = watch("mobileNo");
  const nickname = watch("nickname");
  const suffix = watch("suffix");
  const sex = watch("sex");
  const occupation = watch("occupation");
  const address = watch("address");
  const city = watch("city");
  const barangay = watch("barangay");
  const region = watch("region");
  const zipcode = watch("zipCode");

  const { data: dentistData } = useGetDentist(dentistId!);
  const dentist: TDentist | undefined = dentistData?.data;
  const { data: servicesData, isLoading: isLoadingServices } =
    useGetServicesById({ ids: serviceIds });
  const services: TService[] | undefined = servicesData?.data;

  console.log("services: ", services);

  return (
    <div>
      <Card>
        <CardHeader>Appointment Summary</CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* LOCATION */}
            <div className="grid items-center grid-cols-2">
              <span className="text-sm font-medium text-neutral-500/90">
                Location:
              </span>
              <div className="flex gap-2 mt-1 group">
                <Link
                  to="https://www.google.com/maps/dir/14.5948672,120.9991168/14.6168975,120.9706318/@14.6054999,120.9652494,14z/data=!3m1!4b1!4m4!4m3!1m1!4e1!1m0!5m1!1e1?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                  className="mt-[2px] font-semibold capitalize underline group-hover:text-primary-700 rounded-md text-neutral-700"
                  target="_blank"
                >
                  Juan Luna St 1806, Manila, Philippines
                </Link>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="grid items-center grid-cols-2">
              <span className="text-sm font-medium text-neutral-500/90">
                Requested Date & Time:{" "}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                  {formatAppointmentDate(`${date} ${time}`)}
                </span>
              </div>
            </div>

            {/* PATIENT  */}
            <div className="grid items-center grid-cols-2">
              <span className="text-sm font-medium text-neutral-500/90">
                Booked for:{" "}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <IoPersonCircleOutline className="w-5 h-5" />
                <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                  {createUsername({
                    firstname: firstName,
                    middlename: middleName || "",
                    lastname: lastName,
                  })}
                  {suffix ? <span>{` ${suffix}`}</span> : null}
                </span>
              </div>
            </div>

            {/* DENTIST */}
            <div className="grid items-center grid-cols-2">
              <span className="text-sm font-medium text-neutral-500/90">
                Dentist name:
              </span>
              <div className="flex items-center gap-2">
                <span className="mt-[2px] font-semibold capitalize rounded-md text-neutral-700">
                  {` Dr. ${createUsername({
                    firstname: dentist?.firstName || "",
                    middlename: dentist?.middleName || "",
                    lastname: dentist?.lastName || "",
                  })}`}
                </span>
              </div>
            </div>

            {/* SERVICE */}
            <div className="grid items-center grid-cols-2">
              <span className="text-sm font-medium text-neutral-500/90">
                Dental service:
              </span>
              <div className="flex flex-col gap-1">
                {!isLoadingServices ? (
                  <ReviewAndBookService serviceIds={serviceIds} />
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewAndBook;
