import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCamera } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { Input } from "@/components/ui/input";
import { TCreateDentist, TService } from "@/types/types";
import { createDentistSchema } from "@/types/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateDentist } from "@/service/mutation";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TIME_LIST,
  DENTIST_ROLE_ID,
  DEFAULT_USER_PROFILE_IMG_URL,
} from "@/lib/variables";
import { Separator } from "@/components/ui/separator";
import { useGetAllServices } from "@/service/queries";

const AddNewDentist = () => {
  const { userId } = useAuth();
  const createDentist = useCreateDentist();
  const [showPassword, setShowPassword] = useState(false);
  const { data, isLoading: isLoadingServices } = useGetAllServices();
  const allServices: TService[] = useMemo(() => data?.data || [], [data]);
  const servicesOptions = allServices.map((service) => ({
    value: service.id,
    label: service.title,
  }));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  console.log("services: ", allServices);
  console.log("servicesOptions: ", servicesOptions);
  const form = useForm<TCreateDentist>({
    resolver: zodResolver(createDentistSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      suffix: "",
      profilePicUrl: "",
      roleIds: [DENTIST_ROLE_ID],
      services: [],
      sunday: [{ startTime: "", endTime: "" }],
      monday: [{ startTime: "", endTime: "" }],
      tuesday: [{ startTime: "", endTime: "" }],
      wednesday: [{ startTime: "", endTime: "" }],
      thursday: [{ startTime: "", endTime: "" }],
      friday: [{ startTime: "", endTime: "" }],
      saturday: [{ startTime: "", endTime: "" }],
      createdBy: "",
    },
  });

  useEffect(() => {
    form.setValue("createdBy", userId);
  }, [userId]);

  useEffect(() => {
    form.setValue("createdBy", userId!);
  }, [form, userId]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "toothabodedentalclinic");
    formData.append("folder", "dentist_profiles");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deklgilr5/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImageUploading(false);
      return data.secure_url;
    } catch (error) {
      setImageUploading(false);
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

  const handleCreateDentist: SubmitHandler<TCreateDentist> = async (data) => {
    try {
      if (imageFile) {
        console.log("UPLOADING TO CLOUDINARY");
        const imageUrl = await uploadToCloudinary(imageFile);
        data.profilePicUrl = imageUrl;
      }

      await createDentist.mutate(data);
    } catch (error) {
      console.error("Failed to submit dentist data:", error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClearAvailabiltiy = (name: keyof TCreateDentist) => {
    form.setValue(name, [{ startTime: "--|--", endTime: "--|--" }]);
  };

  console.log("errors: ", form.formState.errors);
  console.log("state: ", form.watch());
  console.log("sunday: ", form.watch("sunday")?.[0]?.startTime);

  return (
    <div>
      <header className=" text-black/80">
        <h1 className="text-neutral-800 leading-[43.2px] font-bold text-[36px]">
          Add New Dentist
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card className="w-full pb-6 mb-6">
          <CardContent className="p-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateDentist)}
                className="flex flex-col justify-between h-full"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* PERSONAL DETAILS */}
                  <CardHeader className="w-full text-center">
                    Personal Details
                  </CardHeader>
                  <div className="flex justify-center w-full gap-6 my-4 ">
                    <div className="relative">
                      <div className=" border shadow-mui-shadow-1 rounded-full overflow-hidden select-none h-[150px] w-[150px]">
                        <img
                          src={
                            imagePreview
                              ? imagePreview
                              : DEFAULT_USER_PROFILE_IMG_URL
                          }
                          alt="Image Preview"
                          className="h-auto max-w-full rounded-md select-none"
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="profilePicUrl"
                        render={({
                          field: { value, onChange, ...fieldProps },
                          fieldState,
                        }) => {
                          return (
                            <FormItem className="absolute bg-neutral-600 p-2 rounded-full outline-white outline top-[110px] right-[10px] flex flex-col hover:bg-neutral-500 trasition-[background-color] duration-200 ease-in-out">
                              <FormControl>
                                <div>
                                  <Label htmlFor="profilePicUrl">
                                    <FaCamera className="w-5 h-5 text-white" />
                                    <Input
                                      {...fieldProps}
                                      id="profilePicUrl"
                                      type="file"
                                      className="hidden"
                                      hidden
                                      placeholder="Upload image"
                                      accept="image/*"
                                      dirty={fieldState?.isDirty}
                                      invalid={fieldState?.invalid}
                                      onChange={handleImageChange}
                                      disabled={imageUploading}
                                    />
                                  </Label>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="w-full max-w-[500px] flex flex-col gap-5">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="firstName">
                                First name
                              </Label>
                              <FormControl>
                                <Input
                                  id="firstName"
                                  type="text"
                                  placeholder="First name"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="lastName">
                                Last name
                              </Label>
                              <FormControl>
                                <Input
                                  id="lastName"
                                  type="text"
                                  placeholder="Last name"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isOptional htmlFor="middleName">
                                Middle name
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="middleName"
                                  type="text"
                                  placeholder="Middle name"
                                  value={field.value || undefined}
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
                        name="suffix"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isOptional htmlFor="suffix">
                                Suffix
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="suffix"
                                  type="text"
                                  placeholder="Suffix"
                                  value={field.value || undefined}
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
                        name="email"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="email">
                                Email
                              </Label>
                              <FormControl>
                                <Input
                                  id="email"
                                  type="email"
                                  autoComplete="username"
                                  placeholder="Email"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                  {...field}
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
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="password">
                                Password
                              </Label>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
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
                      <FormField
                        control={form.control}
                        name="roleIds"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="roles">
                                Role
                              </Label>
                              <FormControl>
                                <MultiSelect
                                  id="roles"
                                  options={[
                                    {
                                      value:
                                        "2957f726-3a0f-40ff-afe4-c86718aecf66",
                                      label: "Admin",
                                    },
                                    {
                                      value:
                                        "241e4ec4-c535-4202-8e01-f53ac71372b6",
                                      label: "Dentist",
                                    },
                                  ]}
                                  onValueChange={field.onChange}
                                  defaultValue={[DENTIST_ROLE_ID]}
                                  placeholder="Select role"
                                  animation={4}
                                  maxCount={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      {!isLoadingServices && (
                        <FormField
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-col ">
                                <Label isRequired htmlFor="services">
                                  Services
                                </Label>
                                <FormControl>
                                  <MultiSelect
                                    id="services"
                                    options={servicesOptions}
                                    onValueChange={field.onChange}
                                    placeholder="Select service"
                                    animation={4}
                                    maxCount={2}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <CardHeader className="w-full text-center border-t">
                    Availability
                  </CardHeader>

                  <div className="grid items-center justify-center grid-cols-3 gap-6 p-4">
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Sunday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="sunday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="sunday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("sunday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedSunday = [
                                        {
                                          ...form.watch("sunday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("sunday", updatedSunday);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="sunday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label className="font-normal" htmlFor="sunday">
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("sunday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedSunday = [
                                        {
                                          ...form.watch("sunday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("sunday", updatedSunday);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("sunday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Monday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="monday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="monday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("monday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("monday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("monday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="monday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label className="font-normal" htmlFor="monday">
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("monday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("monday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("monday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("monday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Tuesday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="tuesday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="tuesday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("tuesday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("tuesday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("tuesday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="tuesday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label
                                  className="font-normal"
                                  htmlFor="tuesday"
                                >
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("tuesday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("tuesday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("tuesday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("tuesday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Wednesday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="wednesday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="wednesday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("wednesday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("wednesday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("wednesday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="wednesday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label
                                  className="font-normal"
                                  htmlFor="wednesday"
                                >
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("wednesday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("wednesday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("wednesday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("wednesday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Thursday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="thursday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="thursday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("thursday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("thursday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("thursday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="thursday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label
                                  className="font-normal"
                                  htmlFor="thursday"
                                >
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("thursday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("thursday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("thursday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("thursday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Friday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="friday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="friday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("friday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("friday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("friday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="friday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label className="font-normal" htmlFor="friday">
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("friday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("friday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("friday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("friday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-md shadow-mui-shadow-1">
                      <h2 className="py-2 font-semibold text-center text-neutral-500">
                        Saturday
                      </h2>
                      <Separator />
                      <div className="relative flex gap-6 p-4">
                        <FormField
                          control={form.control}
                          name="saturday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <FormLabel
                                  className="font-normal"
                                  htmlFor="saturday"
                                >
                                  Start time:
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("saturday")?.[0]?.startTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("saturday")?.[0]!,
                                          startTime: value,
                                        },
                                      ];
                                      form.setValue("saturday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <IoIosArrowRoundForward className="h-4 w-5 absolute top-[50%] left-[50%] translate-x-[-50%]" />
                        <FormField
                          control={form.control}
                          name="saturday"
                          render={() => {
                            return (
                              <FormItem className="w-[100px] flex flex-col ">
                                <Label
                                  className="font-normal"
                                  htmlFor="saturday"
                                >
                                  End time:
                                </Label>
                                <FormControl>
                                  <Select
                                    value={
                                      form.watch("saturday")?.[0]?.endTime ||
                                      "--|--"
                                    }
                                    onValueChange={(value) => {
                                      const updatedTime = [
                                        {
                                          ...form.watch("saturday")?.[0]!,
                                          endTime: value,
                                        },
                                      ];
                                      form.setValue("saturday", updatedTime);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="--:--" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      {TIME_LIST.map((time) => {
                                        return (
                                          <SelectItem
                                            id={time.value}
                                            key={time.value}
                                            value={time.value}
                                          >
                                            {time.label}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleClearAvailabiltiy("saturday")}
                          className="bg-neutral-200 select-none text-neutral-600 py-[4px0] text-sm px-[8px] rounded-sm hover:bg-neutral-300 transition-[background-color] duration-200 ease-in-out"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex content-end justify-center gap-3 mt-10 ">
                  <Button asChild variant="db_outline" size="lg">
                    <Link to="/dentists">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-md"
                    variant={
                      form.formState.isSubmitting && imageUploading
                        ? "db_disabled"
                        : "db_default"
                    }
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewDentist;
