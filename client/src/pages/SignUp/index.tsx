import { useState, ChangeEvent } from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { createPatientSchema } from "@/types/schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TCreatePatient,
  TRegion,
  TProvince,
  TBrgys,
  TBrgysManila,
} from "@/types/types";
import {
  useGetProvincesCities,
  useGetAllRegions,
  useGetBarangays,
} from "@/service/queries";
import brgyOfManila from "@/assets/manilaBrgy.json";
import phFlag from "@/assets/phFlag.png";
import { Checkbox } from "@/components/ui/customCheckbox";
import { CITY_OF_MANILA_CODE, DEFAULT_ROLE_ID } from "@/lib/variables";
import { useCreatePatient } from "@/service/mutation";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const createPatient = useCreatePatient();
  const form = useForm<TCreatePatient>({
    mode: "all",
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      email: "",
      password: "",
      cPassword: "",
      mobileNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      nickname: "",
      birthDay: "",
      sex: "",
      age: "",
      occupation: "",
      religion: "",
      nationality: "Filipino",
      civilStatus: "",
      address: "",
      region: "",
      city: "",
      barangay: "",
      zipCode: 0,
      roleIds: [DEFAULT_ROLE_ID],
    },
  });
  const [step, setStep] = useState(1);
  const [agree, setAgree] = useState<boolean>(false);
  const isFirstStep = step === 1;

  const isMatchPassword = form.watch("password") === form.watch("cPassword");
  const isFirstStepValid =
    !form.formState.errors.email &&
    !form.formState.errors.password &&
    !form.formState.errors.cPassword &&
    !form.formState.errors.mobileNo;

  const isFirstStepTouched =
    form.formState.touchedFields.email &&
    form.formState.touchedFields.password &&
    form.formState.touchedFields.cPassword &&
    form.formState.touchedFields.mobileNo;

  const isSecondStepValid =
    !form.formState.errors.firstName &&
    !form.formState.errors.middleName &&
    !form.formState.errors.lastName &&
    !form.formState.errors.nickname &&
    !form.formState.errors.birthDay &&
    !form.formState.errors.age &&
    !form.formState.errors.occupation &&
    !form.formState.errors.religion &&
    !form.formState.errors.nationality &&
    !form.formState.errors.sex &&
    !form.formState.errors.civilStatus;

  const isSecondStepTouched =
    form.formState.touchedFields.firstName &&
    form.formState.touchedFields.middleName &&
    form.formState.touchedFields.lastName &&
    form.formState.touchedFields.nickname &&
    form.formState.touchedFields.birthDay &&
    form.formState.touchedFields.age &&
    form.formState.touchedFields.occupation &&
    form.formState.touchedFields.religion &&
    form.formState.touchedFields.sex &&
    form.formState.touchedFields.civilStatus;

  const hasSelectRegion = !!form.watch("region");
  const hasSelectCity = !!form.watch("city");
  const hasSelectBrgy = !!form.watch("barangay");

  const { data: regions, isLoading: regionIsLoading } = useGetAllRegions();
  const { data: provincesCities, isLoading: provincesCitiesIsLoading } =
    useGetProvincesCities(
      `${hasSelectRegion && form.watch("region").toString()}`
    );
  const { data: brgys, isLoading: barangayIsLoading } = useGetBarangays(
    `${hasSelectCity && form.watch("city").toString()}`
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword((prev) => !prev);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (
      form.formState.errors.email ||
      form.formState.errors.password ||
      form.formState.errors.mobileNo
    )
      return;
    if (step < 3) {
      setStep(step + 1);
    }
  };
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  // console.log("form: ", form.watch());
  const onSubmit: SubmitHandler<TCreatePatient> = async (data) => {
    const finalData = {
      ...data,
      roleIds: data.roleIds.length
        ? data.roleIds
        : ["92b73582-0dc5-4b3d-a17d-20523d7e0a82"],
    };

    console.log("Submitting data: ", finalData);
    createPatient.mutate(finalData);
  };

  console.log("signup: ", form.watch());

  return (
    <div className={cn("flex overflow-hidden lg:h-fit")}>
      <div
        className="bg-[url('https://res.cloudinary.com/deklgilr5/image/upload/v1738812299/zzlmc39dozb4lbpldy5i.jpg')] bg-no-repeat  bg-cover after:relative after:bg-[linear-gradient(180deg,rgba(201,126,0,0)_36%,rgb(87,62,40)_92.5%,rgb(46,32,0)_100%)]
        after:w-full after:h-full after:top-0 after:left-0 w-3/6 hidden flex-1 lg:w-[1000px] lg:flex  justify-end items-center "
      />

      <div className="flex flex-col flex-1 w-3/6 h-full py-8 mx-auto lg:py-0">
        <Form {...form}>
          <form
            className="flex flex-col h-full gap-8 my-10 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col grow">
              {step === 1 && (
                <div className="w-10/12 min-[450px]:w-[400px] max-[400px]:w-10/12 md:w-[400px] lg:w-[409px] mx-auto self-end ">
                  <h1 className="mb-6 lg:mb-10 font-bold text-center font-poppins text-primary-950 text-[30px] md:text-2xl leading-[45px] md:leading-[48px]">
                    <span className="text-primary-700">Sign</span> Up
                  </h1>
                  <div className="flex flex-col gap-[30px]">
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-[10px]">
                        <p className=" text-xs md:text-base leading-[14.52px] text-center lg:text-left text-neutral-400">
                          Already have an account?
                          <Link
                            to="/login"
                            className="ml-1 font-semibold text-primary-700 hover:underline"
                          >
                            Log In
                          </Link>
                        </p>
                      </div>
                    </div>
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
                      <FormField
                        control={form.control}
                        name="cPassword"
                        render={({ field, fieldState }) => {
                          const hangleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("cPassword");
                          };
                          return (
                            <FormItem className="flex flex-col ">
                              <Label htmlFor="cPassword">
                                Re-type password
                              </Label>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    onChange={hangleChange}
                                    autoComplete="current-password"
                                    id="cPassword"
                                    type={showCPassword ? "text" : "password"}
                                    placeholder="Re-type password"
                                    dirty={fieldState?.isDirty}
                                    invalid={fieldState?.invalid}
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-[50%] right-4 translate-y-[-50%] rounded-full p-2 text-neutral-400"
                                    onClick={toggleCPasswordVisibility}
                                    aria-label={
                                      showCPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {showCPassword ? (
                                      <LuEye className="w-5 h-5" />
                                    ) : (
                                      <LuEyeOff className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              {!isMatchPassword &&
                              field.value &&
                              field.value.length > 0 ? (
                                <FormMessage>
                                  Password did not match
                                </FormMessage>
                              ) : (
                                <FormMessage />
                              )}
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="mobileNo"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("mobileNo");
                          };
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="phoneNumber">
                                Mobile No.
                              </Label>
                              <FormControl>
                                <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5">
                                  <div className="shrink-0 font-inter flex items-center rounded-[3.02px] md:rounded-[4.42px] gap-1 lg:rounded-[5px] border-black/50 border-[0.6px] md:border-[0.88px] lg:border-[1px] px-4 md:px-4 lg:px-4 py-3 md:py-3 lg:py-3 text-xs md:text-sm ">
                                    <img
                                      className="h-[15px] w-[30px]"
                                      src={phFlag}
                                      alt="ph flag"
                                    />
                                    <span className="text-black/50">+ 63</span>
                                  </div>
                                  <div className="w-full">
                                    <Input
                                      {...field}
                                      id="phoneNumber"
                                      onChange={handleChange}
                                      type="tel"
                                      placeholder="Enter your phone number"
                                      dirty={fieldState?.isDirty}
                                      invalid={fieldState?.invalid}
                                    />
                                  </div>
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
              )}

              {step === 2 && (
                <div className="w-11/12 min-[450px]:w-[400px] max-[400px]:w-10/12 md:w-[400px] lg:w-[409px] mx-auto self-end ">
                  <h1 className="mb-6 lg:mb-10 font-bold text-center font-poppins text-primary-950 text-[30px] md:text-2xl leading-[45px] md:leading-[48px]">
                    <span className="text-primary-700">General</span>{" "}
                    Information
                  </h1>
                  <div className="flex flex-col gap-[18px] lg:gap-5">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field, fieldState }) => {
                        const handleChange = (
                          e: ChangeEvent<HTMLInputElement>
                        ) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("firstName");
                        };
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="firstName">
                              First Name
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={handleChange}
                                id="firstName"
                                type="text"
                                placeholder="Enter your firstname"
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
                      name="middleName"
                      render={({ field, fieldState }) => {
                        const hangleChange = (
                          e: ChangeEvent<HTMLInputElement>
                        ) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("middleName");
                        };
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="middlename">
                              Middle Name
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={hangleChange}
                                id="middlename"
                                type="text"
                                placeholder="Enter your middlename"
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
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("lastName");
                          };
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label isRequired htmlFor="lastname">
                                Last Name
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="lastname"
                                  type="text"
                                  placeholder="Enter your lastname"
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
                        name="nickname"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("nickname");
                          };
                          return (
                            <FormItem className="flex flex-col w-[40%] ">
                              <Label isRequired htmlFor="nickname">
                                Nickname
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="nickname"
                                  type="text"
                                  placeholder="Enter your nickname"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="birthDay"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("birthDay");
                          };
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label isRequired htmlFor="birthDate">
                                Birthdate
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="birthDate"
                                  type="date"
                                  className="uppercase"
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
                        name="age"
                        render={({ field }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e.target.value);
                            form.trigger("age");
                          };
                          return (
                            <FormItem className="w-[40%] flex flex-col">
                              <Label isRequired htmlFor="age">
                                Age
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="age"
                                  type="number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("occupation");
                          };
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label htmlFor="occupation">Occupation</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="occupation"
                                  type="text"
                                  placeholder="Enter your occupation"
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
                        name="religion"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("religion");
                          };
                          return (
                            <FormItem className="flex flex-col w-[40%] ">
                              <Label htmlFor="religion">Religion</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="religion"
                                  type="text"
                                  placeholder="Enter your religion"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field, fieldState }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("nationality");
                          };
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label htmlFor="nationality">Nationality</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="nationality"
                                  type="text"
                                  placeholder="Enter your nationality"
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
                        name="sex"
                        render={({ field }) => {
                          const handleChange = (e: string) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("sex");
                          };
                          return (
                            <FormItem className="flex flex-col w-[40%]">
                              <Label isRequired htmlFor="sex">
                                Sex
                              </Label>
                              <Select onValueChange={handleChange}>
                                <FormControl onBlur={field.onBlur}>
                                  <SelectTrigger onBlur={field.onBlur}>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <FormMessage />
                                <SelectContent>
                                  <SelectItem id="Male" key="Male" value="Male">
                                    Male
                                  </SelectItem>
                                  <SelectItem
                                    id="Female"
                                    key="Female"
                                    value="Female"
                                  >
                                    Female
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="civilStatus"
                      render={({ field }) => {
                        const handleChange = (e: string) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("sex");
                        };
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="civilStatus">
                              Civil Status
                            </Label>
                            <Select onValueChange={handleChange}>
                              <FormControl onBlur={field.onBlur}>
                                <SelectTrigger onBlur={field.onBlur}>
                                  <SelectValue placeholder="Single" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                <SelectItem
                                  id="Single"
                                  key="Single"
                                  value="Single"
                                >
                                  Single
                                </SelectItem>
                                <SelectItem
                                  id="Married"
                                  key="Married"
                                  value="Married"
                                >
                                  Married
                                </SelectItem>
                                <SelectItem
                                  id="Widowed"
                                  key="Widowed"
                                  value="Widowed"
                                >
                                  Widowed
                                </SelectItem>
                                <SelectItem
                                  id="Separated"
                                  key="Separated"
                                  value="Separated"
                                >
                                  Separated
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="w-10/12 min-[450px]:w-[400px] max-[400px]:w-10/12 md:w-[400px] lg:w-[409px] mx-auto self-end ">
                  <h1 className="mb-6 lg:mb-10 font-bold text-center font-poppins text-primary-700 text-[30px] md:text-2xl leading-[45px] md:leading-[48px]">
                    Address
                  </h1>
                  <div className="flex flex-col gap-[13.06px] md:gap-5">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field, fieldState }) => {
                        const hangleChange = (
                          e: ChangeEvent<HTMLInputElement>
                        ) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("address");
                        };
                        return (
                          <FormItem className="flex flex-col">
                            <Label isRequired htmlFor="address">
                              Address
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={hangleChange}
                                id="address"
                                placeholder="Enter your address"
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
                      name="region"
                      render={({ field }) => {
                        const handleChange = (e: string) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("region");
                        };
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="regionID">
                              Region
                            </Label>
                            <Select
                              onValueChange={handleChange}
                              disabled={regionIsLoading ? true : false}
                            >
                              <FormControl>
                                <SelectTrigger onBlur={field.onBlur}>
                                  <SelectValue placeholder="Region" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {regions?.data &&
                                  regions?.data?.map((r: TRegion) => (
                                    <SelectItem
                                      id={r?.code}
                                      key={r?.code}
                                      value={r?.name}
                                    >
                                      {r?.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => {
                        const handleChange = (e: string) => {
                          field.onBlur();
                          field.onChange(e);
                          form.trigger("city");
                        };
                        return (
                          <FormItem className="flex flex-col">
                            <Label isRequired htmlFor="cityID">
                              City/Province
                            </Label>
                            <Select
                              onValueChange={handleChange}
                              disabled={provincesCitiesIsLoading ? true : false}
                            >
                              <FormControl>
                                <SelectTrigger onBlur={field.onBlur}>
                                  <SelectValue placeholder="Province / City" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {hasSelectRegion &&
                                  provincesCities?.data &&
                                  provincesCities?.data?.map((r: TProvince) => (
                                    <SelectItem
                                      id={r?.code}
                                      key={r?.code}
                                      value={r?.name}
                                    >
                                      {r?.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }}
                    />
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5">
                      <FormField
                        control={form.control}
                        name="barangay"
                        render={({ field }) => {
                          const handleChange = (e: string) => {
                            field.onBlur();
                            field.onChange(e);
                            form.trigger("barangay");
                          };
                          return (
                            <FormItem className="flex flex-col w-full">
                              <Label isRequired htmlFor="barangayID">
                                Barangay
                              </Label>
                              <Select
                                onValueChange={handleChange}
                                disabled={barangayIsLoading ? true : false}
                              >
                                <FormControl>
                                  <SelectTrigger onBlur={field.onBlur}>
                                    <SelectValue placeholder="Barangay" />
                                  </SelectTrigger>
                                </FormControl>
                                <FormMessage />
                                {form.watch("city") === CITY_OF_MANILA_CODE ? (
                                  <SelectContent>
                                    {hasSelectCity &&
                                      brgyOfManila &&
                                      brgyOfManila.map(
                                        (value: TBrgysManila) => {
                                          return (
                                            <SelectItem
                                              id={value.name}
                                              key={value.name}
                                              value={value.name}
                                            >
                                              {value.name}
                                            </SelectItem>
                                          );
                                        }
                                      )}
                                  </SelectContent>
                                ) : (
                                  <SelectContent>
                                    {hasSelectCity &&
                                      brgys?.data &&
                                      brgys?.data?.map((r: TBrgys) => (
                                        <SelectItem
                                          id={r?.code}
                                          key={r?.code}
                                          value={r?.code}
                                        >
                                          {r?.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                )}
                              </Select>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => {
                          const handleChange = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onBlur();
                            field.onChange(parseInt(e.target.value));
                            form.trigger("nationality");
                          };
                          return (
                            <FormItem className="w-[180px] flex flex-col">
                              <Label isRequired htmlFor="zipCode">
                                Zip Code
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={handleChange}
                                  id="zipCode"
                                  type="number"
                                  placeholder="0000"
                                  disabled={hasSelectBrgy ? false : true}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 mt-10 text-xs ">
                    <p className="font-['Poppins'] font-light">
                      To proceed with the registration, please take a moment to
                      review the
                      <Link to="/">
                        <span className="mx-1 underline text-primary-700">
                          Terms and Conditions
                        </span>
                      </Link>
                      and indicate your acceptance.
                    </p>
                    <div className="flex">
                      <Checkbox
                        id="acceptTerm"
                        checked={agree}
                        onChange={() => setAgree(!agree)}
                      />
                      {/* <input
                        type="checkbox"
                        checked={agree}
                        onChange={() => setAgree(!agree)}
                      /> */}
                      <p className="-ml-2">I accept the terms and condition</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* START Button */}

            <div className="flex flex-col ">
              <div className="flex flex-col items-center justify-center w-[300px] min-[768px]:w-[400px] lg:w-[400px] m-auto">
                <div
                  className={cn(
                    "grid w-full grid-cols-2  md:flex-row justify-center gap-2",
                    isFirstStep && "grid-cols-[35%] md:grid-cols-[50%]"
                  )}
                >
                  {!isFirstStep && (
                    <Button variant="outline" onClick={handlePreviousStep}>
                      Previous
                    </Button>
                  )}
                  {step === 3 ? (
                    <Button
                      type="submit"
                      //   disabled={!agree ? agree : isSubmitting}
                      variant={
                        agree &&
                        !form.formState.isSubmitting &&
                        !(Object.keys(form.formState.errors).length > 0)
                          ? "default"
                          : "disabled"
                      }
                    >
                      Submit
                    </Button>
                  ) : step === 1 ? (
                    <Button
                      variant={
                        isFirstStepValid && isFirstStepTouched
                          ? "default"
                          : "disabled"
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : step === 2 ? (
                    <Button
                      variant={
                        isSecondStepValid && isSecondStepTouched
                          ? "default"
                          : "disabled"
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* END Button */}
              <div className="grid mt-10 place-items-center grow">
                <div className="flex justify-center gap-8">
                  <div
                    className={cn(
                      "h-[10px] w-[10px] cursor-pointer rounded-full bg-neutral-300",
                      step === 1 && "bg-primary-700"
                    )}
                  />
                  <div
                    className={cn(
                      "h-[10px] w-[10px] cursor-pointer rounded-full bg-neutral-300",
                      step === 2 && "bg-primary-700"
                    )}
                  />
                  <div
                    className={cn(
                      "h-[10px] w-[10px] cursor-pointer rounded-full bg-neutral-300",
                      step === 3 && "bg-primary-700"
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* ================== END REGISTRATION FORM ===============   */}
    </div>
  );
};

export default SignUp;
