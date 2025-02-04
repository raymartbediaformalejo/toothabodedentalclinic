import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetPaymentVerification } from "@/service/queries";
import { TPaymentVerification, TPaymentVerificationId } from "@/types/types";
import { formatReadableDate } from "@/lib/utils";
import BookedBy from "@/pages/DashboardDentist/Appointment/components/BookedBy";
import {
  useMarkAsIncompletePaymentVerification,
  useMarkAsOverpaidPaymentVerification,
  useMarkAsVerifiedPaymentVerification,
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

import UserName from "@/pages/DashboardDentist/Appointment/components/UserName";
import Schedule from "./components/Schedule";
import PaymentVerificationStatus from "./components/PaymentVerificationStatus";

const SinglePaymentVerification = () => {
  const navigate = useNavigate();
  const { id: paymentVerificationId } = useParams();
  const [isMarkAsVerifiedPModalOpen, setIsMarkAsVerifiedPModalOpen] =
    useState(false);
  const [isMarkAsIncompleteModalOpen, setIsMarkAsIncompleteModalOpen] =
    useState(false);
  const [isMarkAsOverpaidModalOpen, setIsMarkAsOverpaidModalOpen] =
    useState(false);
  const {
    data: paymentVerificationData,
    isLoading: isLoadingPaymentVerification,
  } = useGetPaymentVerification(paymentVerificationId!);

  const markAsVerifiedPaymentVerification =
    useMarkAsVerifiedPaymentVerification();
  const markAsIncompletePaymentVerification =
    useMarkAsIncompletePaymentVerification();
  const markAsOverpaidPaymentVerification =
    useMarkAsOverpaidPaymentVerification();

  const paymentVefirication: TPaymentVerification = useMemo(
    () => paymentVerificationData?.data || [],
    [paymentVerificationData]
  );

  console.log("paymentVerificationId: ", paymentVerificationId);
  console.log("AdminSingleAppointment: ", paymentVefirication);

  if (isLoadingPaymentVerification) {
    return <div>Loading...</div>;
  }
  const handleMarkAsVerifiedPaymentVerification = async (
    data: TPaymentVerificationId
  ) => {
    try {
      if (data.id) {
        await markAsVerifiedPaymentVerification.mutate(data);
        setIsMarkAsVerifiedPModalOpen(false);
        navigate("/admin/payment-verification");
      }
    } catch (error) {
      console.log("Error verifying payment: ", error);
    }
  };
  const handleMarkAsIncompletePaymentVerification = async (
    data: TPaymentVerificationId
  ) => {
    try {
      if (data.id) {
        await markAsIncompletePaymentVerification.mutate(data);
        setIsMarkAsIncompleteModalOpen(false);
        navigate("/admin/payment-verification");
      }
    } catch (error) {
      console.log("Error mark as incomplete payment: ", error);
    }
  };
  const handleMarkAsOverpaidPaymentVerification = async (
    data: TPaymentVerificationId
  ) => {
    try {
      if (data.id) {
        await markAsOverpaidPaymentVerification.mutate(data);
        setIsMarkAsOverpaidModalOpen(false);
        navigate("/admin/payment-verification");
      }
    } catch (error) {
      console.log("Error mark as overpaid payment: ", error);
    }
  };

  const onOpenMarkAsVerifiedModalChange = () => {
    setIsMarkAsVerifiedPModalOpen((prev) => !prev);
  };

  const onOpenMarkAsIncompleteModalChange = () => {
    setIsMarkAsIncompleteModalOpen((prev) => !prev);
  };

  const onOpenMarkAsOverpaidModalChange = () => {
    setIsMarkAsOverpaidModalOpen((prev) => !prev);
  };

  return (
    <div className=" max-w-[1200px] mx-auto mb-12">
      <header className=" text-black/80">
        <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
          Payment Verification Details
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center  py-[13px]">
            Payment Verification details
          </CardHeader>

          <CardContent className=" w-full flex gap-10">
            <div className="w-[200px] min-w-[35%] flex flex-col gap-4">
              <div className="grid items-center grid-cols-2">
                <span className="text-sm text-neutral-500/90">User:</span>
                <span className="break-words text-neutral-800">
                  <UserName userId={paymentVefirication.userId!} />
                </span>
              </div>
              <div className="grid items-center grid-cols-2">
                <span className="text-sm text-neutral-500/90">
                  No-show appointment/s:
                </span>
                <div>
                  {paymentVefirication.appointmentIds.map((appointmentId) => (
                    <div>
                      <Schedule appointmentId={appointmentId} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid items-center grid-cols-2">
                <span className="text-sm text-neutral-500/90">
                  Payment Status:
                </span>
                <span className=" text-neutral-800">
                  <PaymentVerificationStatus
                    status={paymentVefirication.status}
                  />
                </span>
              </div>
              <div className="grid items-center grid-cols-2">
                <span className="text-sm text-neutral-500/90">Created at:</span>
                <span className=" text-neutral-800">
                  {formatReadableDate(paymentVefirication.createdAt)}
                </span>
              </div>
              <div className="grid items-center grid-cols-2">
                <span className="text-sm text-neutral-500/90">Created by:</span>
                <span className="break-words text-neutral-800">
                  <BookedBy userId={paymentVefirication.createdBy} />
                </span>
              </div>
            </div>

            <div className="w-[45%] min-w-[400px]">
              <span className="text-sm text-neutral-500/90">
                Gcash Receipt:
              </span>
              <div className="border border-neutral-300 justify-center items-center rounded-lg overflow-hidden">
                <img
                  className="w-[50%] min-w-[400px] mx-auto"
                  src={paymentVefirication.gcashReceiptUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center w-full">
        <div className="flex w-full mb-10 mt-6 max-w-[500px] gap-2 px-3 pt-3 pb-2">
          <Dialog
            open={isMarkAsOverpaidModalOpen}
            onOpenChange={onOpenMarkAsOverpaidModalChange}
          >
            <Button
              variant="db_outline"
              className="w-full text-neutral-500  border border-neutral-300  focus:bg-neutral-300/30 hover:bg-neutral-300/30 justify-center bg-neutral-100 rounded-[4px] "
              onClick={onOpenMarkAsOverpaidModalChange}
            >
              Mark as overpaid
            </Button>
            <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
              <DialogHeader className="px-6 pt-8">
                <DialogTitle className="text-2xl font-bold text-center">
                  Mark as Overpaid this Payment Verification
                </DialogTitle>
                <DialogDescription className="text-center text-neutral-600">
                  Are you sure you want to marks as "
                  <span className="text-[#737373] font-semibold">overpaid</span>
                  " this payment verification?{" "}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="px-6 py-4 bg-gray-100">
                <div className="flex items-center justify-center w-full gap-4">
                  <Button
                    className="rounded-md"
                    variant="db_outline"
                    onClick={onOpenMarkAsOverpaidModalChange}
                  >
                    No
                  </Button>
                  <Button
                    variant="db_default"
                    className="text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-md focus:bg-neutral-200/30 hover:bg-neutral-200/30"
                    onClick={() =>
                      handleMarkAsOverpaidPaymentVerification({
                        id: paymentVefirication.id,
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
            open={isMarkAsIncompleteModalOpen}
            onOpenChange={onOpenMarkAsIncompleteModalChange}
          >
            <Button
              variant="db_outline"
              className="w-full text-[#EF4444]  border border-[#EF4444]/50  focus:bg-[#EF4444]/20 hover:bg-[#EF4444]/20 justify-center bg-[#FEF2F2] rounded-[4px]"
              onClick={onOpenMarkAsIncompleteModalChange}
            >
              Mark as incomplete
            </Button>
            <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
              <DialogHeader className="px-6 pt-8">
                <DialogTitle className="text-2xl font-bold text-center">
                  Mark as Incomplete this Payment Verification
                </DialogTitle>
                <DialogDescription className="text-center text-neutral-600">
                  Are you sure you want to mark this as "
                  <span className="text-[#EF4444] font-semibold">
                    incomplete
                  </span>
                  " this appointment?{" "}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="px-6 py-4 bg-gray-100">
                <div className="flex items-center justify-center w-full gap-4">
                  <Button
                    className="rounded-md"
                    variant="db_outline"
                    onClick={onOpenMarkAsIncompleteModalChange}
                  >
                    No
                  </Button>
                  <Button
                    variant="db_default"
                    className="text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-md focus:bg-neutral-200/30 hover:bg-neutral-200/30"
                    onClick={() =>
                      handleMarkAsIncompletePaymentVerification({
                        id: paymentVefirication.id,
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
            open={isMarkAsVerifiedPModalOpen}
            onOpenChange={onOpenMarkAsVerifiedModalChange}
          >
            <Button
              variant="db_outline"
              className="w-full text-[#6366F1]  border border-[#6366F1]/40  focus:bg-[#6366F1]/20 hover:bg-[#6366F1]/20 justify-center bg-[#EEF2FF] rounded-[4px]"
              onClick={onOpenMarkAsVerifiedModalChange}
            >
              Mark as Verified
            </Button>
            <DialogContent className="p-0 overflow-hidden bg-white text-neutral-900">
              <DialogHeader className="px-6 pt-8">
                <DialogTitle className="text-2xl font-bold text-center">
                  Mark as Verified this payment
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
                    onClick={onOpenMarkAsVerifiedModalChange}
                  >
                    No
                  </Button>
                  <Button
                    variant="db_default"
                    className="text-green-600 bg-green-200 border border-green-500/60 rounded-md focus:bg-green-500/30 hover:bg-green-500/30"
                    onClick={() =>
                      handleMarkAsVerifiedPaymentVerification({
                        id: paymentVefirication.id,
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
    </div>
  );
};

export default SinglePaymentVerification;
