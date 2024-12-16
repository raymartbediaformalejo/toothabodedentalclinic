import { ChangeEvent, useState } from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { loginUserSchema } from "@/types/schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TLoginUser } from "@/types/types";
import { useLoginUser } from "@/service/mutation";

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLoginUser();
  const form = useForm<TLoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isCredentialValid =
    !form.formState.errors.email && !form.formState.errors.password;

  const isCredentialTouched =
    form.formState.touchedFields.email && form.formState.touchedFields.password;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<TLoginUser> = async (data) => {
    login.mutate(data);
  };

  return (
    <div className={cn("flex overflow-hidden lg:h-fit")}>
      <div
        className="bg-[url('/src/assets/img/LoginImg2.png')] bg-no-repeat bg-top bg-cover after:relative after:bg-[linear-gradient(180deg,rgba(255,255,255,0)_36%,rgb(0,153,255)_92.5%,rgb(0,138,230)_100%)]
        after:w-full after:h-full after:top-0 after:left-0 w-3/6 hidden flex-1 lg:w-[1000px] lg:flex  justify-end items-center "
      />

      {/* ================== START REGISTRATION FORM ===============   */}
      <div className="flex flex-col flex-1 w-3/6 h-full py-8 mx-auto lg:py-0">
        <Form {...form}>
          <form
            className="flex flex-col h-full gap-8 my-10 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col grow">
              <div className="w-10/12 min-[450px]:w-[400px] max-[400px]:w-10/12 md:w-[400px] lg:w-[409px] mx-auto self-end ">
                <h1 className="mb-6 lg:mb-10 font-bold text-center font-poppins text-primary-950 text-[30px] md:text-2xl leading-[45px] md:leading-[48px]">
                  <span className="text-primary-700">Log</span> In
                </h1>
                <div className="flex flex-col gap-[30px]">
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => {
                        const handleChange = (
                          e: ChangeEvent<HTMLInputElement>
                        ) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("email");
                        };
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="email">
                              Email
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={handleChange}
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                dirty={fieldState?.isDirty}
                                invalid={fieldState?.invalid}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => {
                        const hangleChange = (
                          e: ChangeEvent<HTMLInputElement>
                        ) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("password");
                        };
                        return (
                          <FormItem className="flex flex-col ">
                            <Label htmlFor="password">Password</Label>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  onChange={hangleChange}
                                  autoComplete="current-password"
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                />
                                <button
                                  type="button"
                                  className="absolute top-[50%] right-4 translate-y-[-50%] rounded-full p-2 text-neutral-400"
                                  onClick={togglePasswordVisibility}
                                  aria-label={
                                    showPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  {showPassword ? (
                                    <LuEye className="w-5 h-5" />
                                  ) : (
                                    <LuEyeOff className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* START Button */}

            <div className="flex flex-col ">
              <div className="flex flex-col items-center justify-center w-[300px] min-[768px]:w-[400px] lg:w-[400px] m-auto">
                <div
                  className={cn(
                    "grid w-full   md:flex-row justify-center gap-2 grid-cols-[35%] md:grid-cols-[50%]"
                  )}
                >
                  <Button
                    type="submit"
                    variant={
                      isCredentialTouched && isCredentialValid
                        ? "default"
                        : "disabled"
                    }
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-[10px]">
                <p className=" text-xs md:text-base leading-[14.52px] text-center lg:text-left text-neutral-400">
                  Don't have an account?
                  <Link
                    to="/signup"
                    className="ml-1 font-semibold text-primary-700 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* ================== END REGISTRATION FORM ===============   */}
    </div>
  );
};

export default LogIn;
