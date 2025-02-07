import { MdOutlineDoNotDisturb } from "react-icons/md";
import { useEffect, useState } from "react";

import H1 from "@/components/ui/H1";
import H3 from "@/components/ui/H3";
import { Separator } from "@/components/ui/separator";
import P from "@/components/ui/P";
import { Button } from "@/components/ui/button";
import {
  useGetPenalty,
  useGetUserAppoitmentNoShowSchedule,
} from "@/service/queries";
import {
  TCreatePaymentVerification,
  TPenalty,
  TUserNoShowSchedule,
} from "@/types/types";
import useAuth from "@/hooks/useAuth";
import { formatAppointmentDate } from "@/lib/utils";
import { useCreatePaymentVerification } from "@/service/mutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPaymentVerificationSchema,
} from "@/types/schema";
import { Form } from "@/components/ui/form";

const NoShowRestricted = () => {
  const { userId } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [imageUploading, setImageUploading] = useState<boolean>(false);
  const {
    data: userNoShowAppointmentData,
    isLoading: isLoadingNoShowAppointment,
  } = useGetUserAppoitmentNoShowSchedule(userId!);
  const userNoShowAppointment: TUserNoShowSchedule | undefined =
    userNoShowAppointmentData?.data;

  const form = useForm<TCreatePaymentVerification>({
    defaultValues: {
      userId: "",
      gcashReceiptUrl: "",
      appointmentIds: [],
      createdBy: "",
    },
    resolver: zodResolver(createPaymentVerificationSchema),
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const { data: penaltyData, isError } = useGetPenalty();
  const penalty: TPenalty = penaltyData || {
    penaltyFee: 0,
    gcashQrCodeUrl: "",
  };
  const createPaymentVerification = useCreatePaymentVerification();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    console.log("uploadToCloudinary");
    // setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "toothabodedentalclinic");
    formData.append("folder", "payment_verification");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deklgilr5/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("uploadToCloudinary: ", data);
      // setImageUploading(false);
      return data.secure_url;
    } catch (error) {
      // setImageUploading(false);
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePaymentVerification: SubmitHandler<
    TCreatePaymentVerification
  > = async (data) => {
    console.log("data: ", data);

    try {
      if (imageFile) {
        console.log("UPLOADING TO CLOUDINARY");
        const imageUrl = await uploadToCloudinary(imageFile);
        data.gcashReceiptUrl = imageUrl;
        form.setValue("gcashReceiptUrl", imageUrl, { shouldValidate: true });
      } else {
        console.log("NOT UPLOADING TO CLOUDINARY");
      }
      await createPaymentVerification.mutate(data);
    } catch (error) {
      console.error("Failed to submit dentist data:", error);
    }
  };

  if (isError) {
    return (
      <p className="text-red-500">
        Failed to load penalty data. Please try again later.
      </p>
    );
  }

  useEffect(() => {
    const hasImage = !!imageFile || !!form.watch("gcashReceiptUrl");
    setIsSubmitDisabled(!hasImage); // Enable if there is an image file or URL
  }, [imageFile, form.watch("gcashReceiptUrl")]);

  useEffect(() => {
    if (userId) {
      form.setValue("userId", userId);
      form.setValue("createdBy", userId);
    }
  }, []);

  useEffect(() => {
    if (
      !isLoadingNoShowAppointment &&
      userNoShowAppointment &&
      userNoShowAppointment?.appointments.length! > 0
    ) {
      console.log("userNoShowAppointment : ", userNoShowAppointment);

      const ids = userNoShowAppointment?.appointments.map(
        (appointment) => appointment.id
      );
      form.setValue("appointmentIds", ids!);
    }
  }, [isLoadingNoShowAppointment, userNoShowAppointment]);

  console.log("form errors: ", form.formState.errors);
  console.log("form state: ", form.watch());
  console.log("isSubmitDisabled: ", isSubmitDisabled);

  // if (!isLoadingNoShowAppointment)
  console.log("userNoShowAppointmentData: ", userNoShowAppointmentData);

  return (
    <div>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1 className="">
          Account <span className="text-primary-700">Restricted</span>
        </H1>
      </header>

      <div className="mx-4 my-8">
        {/* Account Restriction Info */}
        <div>
          <div className="flex items-center justify-center gap-2 text-red-500">
            <MdOutlineDoNotDisturb className="w-6 h-6" />
            <h2 className="text-[24px] font-bold">Account Restricted</h2>
          </div>
          <P className="px-4 py-3 mt-2 text-sm text-center text-red-800 bg-red-100 rounded-sm">
            Your account is currently restricted due to a missed appointment
            without notice.
          </P>
        </div>

        <Separator className="mt-8" />

        <>
          <div className="mt-6">
            <H3 className="text-primary-950">Why Am I Restricted?</H3>
            <P className="mt-1">
              You missed your appointment scheduled for{" "}
              <span className="font-semibold text-primary-700">
                [
                {userNoShowAppointment?.appointments
                  .map((schedule) => formatAppointmentDate(schedule.schedule))
                  .join(" and ")}
                ]
              </span>{" "}
              without providing notice. A penalty fee of{" "}
              {
                <span className="font-semibold text-primary-700">
                  ₱{penalty.penaltyFee}:00
                </span>
              }{" "}
              is required to restore your account access.
            </P>
          </div>

          <div className="mt-6">
            <H3 className="text-primary-950">How to Pay</H3>
            <ol className="flex flex-col gap-1 mt-1 ml-4 list-decimal">
              <li className="text-sm">Scan the QR code below using GCash.</li>
              <li className="text-sm">
                Enter the penalty fee:{" "}
                {
                  <span className="font-semibold text-primary-700">
                    ₱{penalty.penaltyFee}:00
                  </span>
                }
              </li>
              <li className="text-sm">Save the transaction receipt.</li>
              <li className="text-sm">
                Save or screenshot the transaction receipt.
              </li>
            </ol>
            <div className="flex justify-center w-full mt-6">
              <img
                id="payment_url"
                className="object-contain overflow-hidden rounded-lg w-full max-w-[270px] rounded-t-[8px]"
                src={penalty.gcashQrCodeUrl}
                alt="gcash qr code"
              />
            </div>
          </div>
        </>

        <Separator className="mt-8" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreatePaymentVerification)}>
            <div className="flex flex-col justify-center mt-6">
              <H3 className="text-primary-950">
                Submit Payment for Verification
              </H3>
              <P className="mt-1">
                Upload your payment receipt here after completing the payment.
                The verification process may take 24-48 hours.
              </P>

              <div
                id="image-preview"
                className="flex flex-col items-center justify-center w-full h-64 my-6 overflow-hidden border-2 border-dashed rounded-lg cursor-pointer border-neutral-300 bg-neutral-100 hover:bg-neutral-200"
              >
                {imagePreview ? (
                  <label htmlFor="upload">
                    <img
                      src={imagePreview}
                      alt="Uploaded Preview"
                      className="mx-auto max-h-48"
                    />
                  </label>
                ) : (
                  <label
                    htmlFor="upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8 mb-4 text-neutral-700 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-neutral-700 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-neutral-700 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </label>
                )}

                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  {...form.register("gcashReceiptUrl")}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {form.formState.errors.gcashReceiptUrl && (
                <span className="text-sm text-destructive">
                  {form.formState.errors.gcashReceiptUrl.message}
                </span>
              )}

              <Button
                type="submit"
                variant={isSubmitDisabled ? "disabled" : "default"}
                disabled={isSubmitDisabled}
                className="self-center mt-6"
              >
                Submit Payment Receipt
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NoShowRestricted;
