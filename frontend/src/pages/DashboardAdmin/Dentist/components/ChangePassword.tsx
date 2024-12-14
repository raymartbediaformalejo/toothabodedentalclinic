import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TChangePassword } from "@/types/types";
import { changePasswordSchema } from "@/types/schema";
import { useChangeDentistPassword } from "@/service/mutation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ChangePassword = () => {
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const changePassword = useChangeDentistPassword();

  const form = useForm<TChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      id: "",
      password: "",
      newPassword: "",
      cPassword: "",
    },
  });

  useEffect(() => {
    if (id) form.setValue("id", id);
  }, [form, id]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };
  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword((prev) => !prev);
  };

  const handleChangeDentistPassword: SubmitHandler<TChangePassword> = async (
    data
  ) => {
    try {
      await changePassword.mutate(data);
    } catch (error) {
      console.error("Failed to change password: ", error);
    }
  };

  console.log("values: ", form.watch());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="db_outline" size="sm">
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Your password must start with an uppercase letter, include lowercase
            letters, numbers, and special characters, and be at least 6
            characters long
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChangeDentistPassword)}>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className="flex flex-col w-full">
                        <Label htmlFor="password">Current password</Label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              autoComplete="current-password"
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Current password"
                              dirty={fieldState?.isDirty}
                              invalid={fieldState?.invalid}
                            />
                            <button
                              type="button"
                              className="absolute top-[50%] right-4 translate-y-[-50%] rounded-full p-2 text-neutral-400"
                              onClick={togglePasswordVisibility}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
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
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className="flex flex-col ">
                        <Label htmlFor="newPassword">New password</Label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              autoComplete="current-password"
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="New password"
                              dirty={fieldState?.isDirty}
                              invalid={fieldState?.invalid}
                            />
                            <button
                              type="button"
                              className="absolute top-[50%] right-4 translate-y-[-50%] rounded-full p-2 text-neutral-400"
                              onClick={toggleNewPasswordVisibility}
                              aria-label={
                                showNewPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showNewPassword ? (
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
                <FormField
                  control={form.control}
                  name="cPassword"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className="flex flex-col ">
                        <Label htmlFor="cPassword">Re-type password</Label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              autoComplete="current-password"
                              id="cPassword"
                              type={showRetypePassword ? "text" : "password"}
                              placeholder="Re-type password"
                              dirty={fieldState?.isDirty}
                              invalid={fieldState?.invalid}
                            />
                            <button
                              type="button"
                              className="absolute top-[50%] right-4 translate-y-[-50%] rounded-full p-2 text-neutral-400"
                              onClick={toggleRetypePasswordVisibility}
                              aria-label={
                                showRetypePassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showRetypePassword ? (
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

                <div className="flex justify-center w-full mt-6">
                  <Button variant="db_default" size="lg" className="wif">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
