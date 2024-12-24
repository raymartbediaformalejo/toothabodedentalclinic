import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { defineStepper } from "@stepperize/react";

import {
  appointmentInfoSchema,
  medicalHistorySchema,
  patientInfoSchema,
  requestDateTimeSchema,
} from "@/types/schema";
import { TAppointmentInfo, TRequestDateAndTime } from "@/types/types";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import H1 from "@/components/ui/H1";
import AppointmentInfo from "./components/AppointmentInfo";
import RequestDateAndTime from "./components/RequestDateAndTime";
import PatientInfo from "./components/PatientInfo";
import MedicalHistory from "./components/MedicalHistory";
import ReviewAndBook from "./components/ReviewAndBook";

const { useStepper, steps } = defineStepper(
  {
    id: "appointmentInfo",
    label: "Appointment Info",
    schema: appointmentInfoSchema,
  },
  {
    id: "requestDateTime",
    label: "Request Date & Time",
    schema: requestDateTimeSchema,
  },
  {
    id: "patientInfo",
    label: "Patient Info",
    schema: patientInfoSchema,
  },
  {
    id: "medicalHistory",
    label: "Medical History",
    schema: medicalHistorySchema,
  },
  {
    id: "reviewAndBook",
    label: "Review and Book",
    schema: z.object({}),
  }
);
const Appointment = () => {
  const stepper = useStepper();

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
  });

  const [isAppoitmentInfoValid, setIsAppoitmentInfoValid] =
    React.useState(false);
  const [isRequestDateAndTimeValid, setIsRequestDateAndTimeValid] =
    React.useState(false);

  const saveAppointmentInfoDataHandler = (
    enteredAppointmentInfo: TAppointmentInfo
  ) => {
    setIsAppoitmentInfoValid(
      enteredAppointmentInfo?.serviceIds?.length > 0 &&
        !!enteredAppointmentInfo.dentistId
    );
  };
  const saveRequestDateAndTimeDataHandler = (
    enteredRequestDateAndTimeInfo: TRequestDateAndTime
  ) => {
    setIsRequestDateAndTimeValid(
      !!enteredRequestDateAndTimeInfo.date &&
        !!enteredRequestDateAndTimeInfo.time
    );
  };

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    console.log(`Form values for step ${stepper.current.id}:`, values);
    if (stepper.isLast) {
      stepper.reset();
    } else {
      stepper.next();
    }
  };

  console.log("APPOINTMENT STATE: ", form.watch());
  console.log("APPOINTMENT ERROR: ", form.formState.errors);

  return (
    <>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1 className="">
          Make an <span className="text-primary-700">Appointment</span>
        </H1>
        <p className="text-primary-950 -mt-1 text-[14px]">
          We prioritize your smile and satisfaction
        </p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 space-y-6 rounded-lg "
        >
          <div className="flex justify-between">
            <div className="flex items-center justify-end w-full gap-2">
              <span className="self-end text-sm text-muted-foreground">
                Step {stepper.current.index + 1} of {steps.length}
              </span>
            </div>
          </div>
          <nav aria-label="Checkout Steps" className="my-4 group">
            <ol
              className="flex items-center justify-between gap-2"
              aria-orientation="horizontal"
            >
              {stepper.all.map((step, index, array) => (
                <React.Fragment key={step.id}>
                  <li className="flex items-center flex-shrink-0 gap-4">
                    <div
                      aria-current={
                        stepper.current.id === step.id ? "step" : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      className={cn(
                        "flex items-center select-none justify-center rounded-full size-10",
                        index <= stepper.current.index
                          ? "bg-neutral-700 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      )}
                    >
                      {index + 1}
                    </div>
                  </li>
                  {index < array.length - 1 && (
                    <Separator
                      className={`flex-1 ${
                        index < stepper.current.index
                          ? "bg-neutral-700"
                          : "bg-neutral-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
          <h2 className="pt-4 font-semibold text-center heading-3 text-primary-950">
            {stepper.current.label}
          </h2>
          <div className="">
            {stepper.switch({
              appointmentInfo: () => (
                <AppointmentInfo
                  onSaveAppointmentInfoData={saveAppointmentInfoDataHandler}
                />
              ),
              requestDateTime: () => (
                <RequestDateAndTime
                  onSaveRequestDateAndTimeData={
                    saveRequestDateAndTimeDataHandler
                  }
                />
              ),
              patientInfo: () => <PatientInfo />,
              medicalHistory: () => <MedicalHistory sex={form.watch("sex")} />,
              reviewAndBook: () => <ReviewAndBook />,
            })}
            {!stepper.isLast ? (
              <div className="flex justify-end gap-4 mt-16 mb-4 ">
                {stepper.isFirst ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stepper.prev}
                    disabled={stepper.isFirst}
                    asChild
                    className="w-[50%]"
                  >
                    <Link to="/">Cancel</Link>
                  </Button>
                ) : stepper.current.id === "patientInfo" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => stepper.goTo("requestDateTime")}
                    disabled={stepper.isFirst}
                    className="w-[50%]"
                  >
                    Previous
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stepper.prev}
                    disabled={stepper.isFirst}
                    className="w-[50%]"
                  >
                    Previous
                  </Button>
                )}

                {stepper.current.id === "appointmentInfo" ? (
                  <Button
                    type="submit"
                    variant={isAppoitmentInfoValid ? "default" : "disabled"}
                    disabled={!isAppoitmentInfoValid}
                    className="w-[50%]"
                  >
                    Next
                  </Button>
                ) : stepper.current.id === "requestDateTime" ? (
                  <Button
                    type="submit"
                    className="w-[50%]"
                    variant={isRequestDateAndTimeValid ? "default" : "disabled"}
                    disabled={!isRequestDateAndTimeValid}
                  >
                    {stepper.isLast ? "Complete" : "Next"}
                  </Button>
                ) : (
                  <Button type="submit" className="w-[50%]">
                    {stepper.isLast ? "Complete" : "Next"}
                  </Button>
                )}
              </div>
            ) : (
              <Button type="button" onClick={stepper.reset} className="w-[50%]">
                Reset
              </Button>
            )}
            {stepper.current.id === "requestDateTime" ? (
              <p className="text-center text-neutral-600 text-[12px]">
                Tooth Abode Dental Clinic - Pritil, Tondo will need to approve
                your proposed data and time in order to confirm your
                appointment.
              </p>
            ) : null}
          </div>
        </form>
      </Form>
    </>
  );
};

export default Appointment;
