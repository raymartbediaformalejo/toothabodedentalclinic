import { SubmitHandler, useForm } from "react-hook-form";

import { useVerifyEmail } from "@/service/mutation";
import { TVerifyEmail } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "@/types/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const EmailVerification = () => {
  const { userId } = useAuth();
  console.log("userId: ", userId);
  const verifyEmail = useVerifyEmail();
  const form = useForm<TVerifyEmail>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<TVerifyEmail> = async (data) => {
    verifyEmail.mutate(data);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center my-20">
            <img
              src="https://res.cloudinary.com/deklgilr5/image/upload/c_scale,h_580,w_1000/ke8st7kgfvv8hkjwhgzk"
              className="select-none max-w-[50%] self-center"
            />
            <h2 className="self-center mt-6 text-lg font-bold text-neutral-700">
              Verify Your Email Address
            </h2>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="self-center mb-10">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup className="flex gap-4 pl-2">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="pt-2 text-neutral-800">
                    Please enter the 6-digit code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-center ">
              Verify Email
            </Button>

            <button
              type="button"
              className="text-[12px] font-semibold underline text-neutral-700 mt-4"
            >
              Resend Code
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailVerification;
