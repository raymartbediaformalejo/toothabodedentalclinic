import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createUsername, formatDate, formatTimeTo12Hour } from "@/lib/utils";
import { useGetDentist, useGetServicesById } from "@/service/queries";
import {
  TAppointmentInfo,
  TDentist,
  TPatientInfo,
  TRequestDateAndTime,
  TService,
} from "@/types/types";
import { useFormContext } from "react-hook-form";

const ReviewAndBook = () => {
  const { watch, setValue } = useFormContext<
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
      <h2>Appointment Summary</h2>

      <div>
        <h3 className="font-semibold text-neutral-800 ">Service Details</h3>
        <div className="grid grid-cols-2">
          <>
            <span>Dentist name:</span>
            <p>
              {createUsername({
                firstname: dentist?.firstName || "",
                middlename: dentist?.middleName || "",
                lastname: dentist?.lastName || "",
              })}
            </p>
          </>

          <>
            <span>Service:</span>
            <div>
              {!isLoadingServices &&
                services &&
                services.map((service) => <p>{service.title}</p>)}
            </div>
          </>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-neutral-800 ">
          Appointment Date and Time
        </h3>
        <div className="grid grid-cols-2">
          <>
            <span>Date:</span>
            <p>{formatDate(date)}</p>
          </>

          <>
            <span>Time:</span>
            <p>{formatTimeTo12Hour(time)}</p>
          </>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-neutral-800 ">Patient Info</h3>
        <div className="grid grid-cols-2">
          <>
            <span>Name</span>
            <p>
              {createUsername({
                firstname: firstName || "",
                middlename: middleName || "",
                lastname: lastName || "",
              })}
            </p>
          </>

          <>
            <span>Birthday:</span>
            <p>{formatDate(time)}</p>
          </>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndBook;
