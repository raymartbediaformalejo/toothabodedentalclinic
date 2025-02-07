import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multiselect";
import useAuth from "@/hooks/useAuth";
import { cn, createUsername } from "@/lib/utils";
import { DEFAULT_USER_PROFILE_IMG_URL } from "@/lib/variables";
import { useGetAllDentist, useGetAllServices } from "@/service/queries";
import { TAppointmentInfo, TDentist, TService } from "@/types/types";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

type TServicesOption = { value: string; label: string };
type TAppointmentInfoProps = {
  onSaveAppointmentInfoData: (enteredAppointmentInfo: TAppointmentInfo) => void;
};

const AppointmentInfo = (props: TAppointmentInfoProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId } = useAuth();
  const { data } = useGetAllServices();
  const allServices: TService[] = useMemo(() => {
    return (data?.data || []).sort(
      (a: TService, b: TService) =>
        (a.orderNo as number) - (b.orderNo as number)
    );
  }, [data]);
  const servicesOption: TServicesOption[] = allServices.map((service) => ({
    value: service.id,
    label: service.title,
  }));

  const { data: dentistData, isLoading: isLoadingDentist } = useGetAllDentist();
  const allDentists: TDentist[] = useMemo(
    () => dentistData?.data || [],
    [dentistData]
  );

  const { watch, setValue, register, trigger, formState } =
    useFormContext<TAppointmentInfo>();
  const patientId = watch("patientId");
  const serviceIds = watch("serviceIds") || [];
  const dentistId = watch("dentistId");

  useEffect(() => {
    if (userId) setValue("patientId", userId);
  }, [userId]);

  useEffect(() => {
    const dentistParam = searchParams.get("dentist");
    if (dentistParam) {
      try {
        const dentistId = JSON.parse(decodeURIComponent(dentistParam));
        setValue("dentistId", dentistId);
      } catch (e) {
        console.error("Error parsing dentistId:", e);
        setValue("dentistId", ""); // Set default value or handle accordingly
      }
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    const appointmentData = { patientId, serviceIds, dentistId };
    props.onSaveAppointmentInfoData(appointmentData);
  }, [patientId, serviceIds, dentistId]);

  // Filter dentists based on selected serviceIds
  const filteredDentists = useMemo(
    () =>
      allDentists.filter((dentist) =>
        dentist.services.some((service) =>
          (serviceIds || []).includes(service || "")
        )
      ),
    [allDentists, serviceIds]
  );

  return (
    <div className="">
      <div className="">
        <p className="mt-8 md:mx-auto md:text-lg md:text-center md:w-full md:max-w-[600px] text-[14px] text-neutral-800 leading-[160%]">
          What dental service would you like to schedule an appointment for?
        </p>
        <div className="mt-4 md:mx-auto w-full max-w-[600px] md:mt-6">
          <Label
            isRequired
            htmlFor={register("serviceIds").name}
            className="block text-sm font-medium text-primary"
          >
            Dental Services:
          </Label>
          <MultiSelect
            id={register("serviceIds").name}
            type="button"
            name={register("serviceIds").name}
            options={servicesOption}
            maxCount={1}
            onBlur={register("serviceIds").onBlur}
            onValueChange={(values) => {
              setValue("serviceIds", values);
              trigger("serviceIds");
            }}
            value={serviceIds || []}
            defaultValue={serviceIds}
            placeholder="Select dental services"
            className="mt-2 "
          />
          {formState.errors.serviceIds && (
            <span className="text-sm text-destructive">
              {formState.errors.serviceIds.message}
            </span>
          )}
        </div>
        {serviceIds.length > 0 ? (
          <div className="mt-12">
            <p className="mt-8  md:mx-auto md:text-lg md:text-center md:w-full md:max-w-[600px] text-[14px] text-neutral-800 leading-[160%]">
              Please select your preferred dentist to proceed with booking your
              appointment.
            </p>
            <Label
              isRequired
              className="block mt-4 text-sm font-medium text-primary"
            >
              Our Dentist:
            </Label>
            <div className="grid w-full max-w-[800px] grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4 mt-2">
              {!isLoadingDentist &&
                filteredDentists.map((dentist) => {
                  const isSelected = dentistId === dentist.id;

                  return (
                    <button
                      key={dentist.id}
                      type="button"
                      onClick={() => {
                        setValue("dentistId", dentist.id);
                        setSearchParams((prev) => {
                          prev.set(
                            "dentist",
                            encodeURIComponent(JSON.stringify(dentist.id))
                          );
                          return prev;
                        });
                      }}
                      className={cn(
                        "cursor-pointer select-none shadow-mui-shadow-1 border border-neutral-300 rounded-[8px] transition",
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-300"
                      )}
                    >
                      <input
                        id={dentist.id}
                        type="radio"
                        value={dentist.id}
                        checked={isSelected}
                        onChange={() => setValue("dentistId", dentist.id)}
                        className="hidden"
                      />
                      <img
                        src={
                          dentist.profilePicUrl
                            ? dentist.profilePicUrl
                            : DEFAULT_USER_PROFILE_IMG_URL
                        }
                        alt={dentist.firstName}
                        className=" bg-top w-full rounded-t-[8px] "
                      />
                      <h3 className="px-4 py-3 leading-4 font-semibold text-left text-neutral-900 text-[12px]">
                        {`Dr. ${createUsername({
                          firstname: dentist?.firstName,
                          middlename: dentist.middleName || "",
                          lastname: dentist?.lastName,
                        })}`}
                      </h3>
                    </button>
                  );
                })}
            </div>
            {formState.errors.dentistId && (
              <span className="text-sm text-destructive">
                {formState.errors.dentistId.message}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppointmentInfo;
