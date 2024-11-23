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
import { Checkbox } from "@/components/ui/checkbox";
import { CITY_OF_MANILA_CODE, DEFAULT_ROLE_ID } from "@/lib/variables";
import { useCreatePatient } from "@/service/mutation";

const SignUp = () => {
  const createPatient = useCreatePatient();
  const form = useForm<TCreatePatient>({
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
      age: undefined,
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

  return (
    <div className={cn("flex overflow-hidden lg:h-fit")}>
      <div
        className="bg-[url('/src/assets/img/LoginImg2.png')] bg-no-repeat bg-top bg-cover after:relative after:bg-[linear-gradient(180deg,rgba(255,255,255,0)_36%,rgb(0,153,255)_92.5%,rgb(0,138,230)_100%)]
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
                            to="/log-in"
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
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="email">
                                Email
                              </Label>
                              <FormControl>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="Enter your email"
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
                          const changeHandler = (
                            e: ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onChange(e);
                            form.trigger("password");
                          };
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="password">
                                Password
                              </Label>
                              <FormControl>
                                <Input
                                  id="password"
                                  type="password"
                                  onChange={changeHandler}
                                  placeholder="Enter your password"
                                  value={field.value}
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
                        name="cPassword"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="cPassword">
                                Confirm password
                              </Label>
                              <FormControl>
                                <Input
                                  id="cPassword"
                                  type="cPassword"
                                  placeholder="Confirm your password"
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
                        name="mobileNo"
                        render={({ field, fieldState }) => {
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
                                      id="phoneNumber"
                                      type="tel"
                                      placeholder="Enter your phone number"
                                      dirty={fieldState?.isDirty}
                                      invalid={fieldState?.invalid}
                                      {...field}
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
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="firstName">
                              First Name
                            </Label>
                            <FormControl>
                              <Input
                                id="firstName"
                                type="text"
                                placeholder="Enter your firstname"
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
                            <Label htmlFor="middlename">Middle Name</Label>
                            <FormControl>
                              <Input
                                id="middlename"
                                type="text"
                                placeholder="Enter your middlename"
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
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label isRequired htmlFor="lastname">
                                Last Name
                              </Label>
                              <FormControl>
                                <Input
                                  id="lastname"
                                  type="text"
                                  placeholder="Enter your lastname"
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
                        name="nickname"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col w-[40%] ">
                              <Label htmlFor="nickname">Nickname</Label>
                              <FormControl>
                                <Input
                                  id="nickname"
                                  type="text"
                                  placeholder="Enter your nickname"
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
                    </div>
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="birthDay"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label isRequired htmlFor="birthDate">
                                Birthdate
                              </Label>
                              <FormControl>
                                <Input
                                  id="birthDate"
                                  type="date"
                                  className="uppercase"
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
                        name="age"
                        render={({ field }) => (
                          <FormItem className="w-[40%] flex flex-col">
                            <Label isRequired htmlFor="age">
                              Age
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                id="age"
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value ? parseInt(value) : value
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label htmlFor="occupation">Occupation</Label>
                              <FormControl>
                                <Input
                                  id="occupation"
                                  type="text"
                                  placeholder="Enter your occupation"
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
                        name="religion"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col w-[40%] ">
                              <Label htmlFor="religion">Religion</Label>
                              <FormControl>
                                <Input
                                  id="religion"
                                  type="text"
                                  placeholder="Enter your religion"
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
                    </div>
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5 ">
                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col w-[60%] ">
                              <Label htmlFor="nationality">Nationality</Label>
                              <FormControl>
                                <Input
                                  id="nationality"
                                  type="text"
                                  placeholder="Enter your nationality"
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
                        name="sex"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-[40%]">
                            <Label isRequired htmlFor="sex">
                              Sex
                            </Label>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="M/F" />
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
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="civilStatus"
                      render={({ field }) => (
                        <FormItem className="flex flex-col ">
                          <Label isRequired htmlFor="civilStatus">
                            Civil Status
                          </Label>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
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
                      )}
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
                        return (
                          <FormItem className="flex flex-col">
                            <Label isRequired htmlFor="address">
                              Address
                            </Label>
                            <FormControl>
                              <Input
                                id="address"
                                type="text"
                                placeholder="Enter your address"
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
                      name="region"
                      render={({ field }) => (
                        <FormItem className="flex flex-col ">
                          <Label isRequired htmlFor="regionID">
                            Region
                          </Label>
                          <Select
                            onValueChange={field.onChange}
                            disabled={regionIsLoading ? true : false}
                          >
                            <FormControl>
                              <SelectTrigger>
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
                                    value={r?.code}
                                  >
                                    {r?.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Label isRequired htmlFor="cityID">
                            City/Province
                          </Label>
                          <Select
                            onValueChange={field.onChange}
                            disabled={provincesCitiesIsLoading ? true : false}
                          >
                            <FormControl>
                              <SelectTrigger>
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
                                    value={r?.code}
                                  >
                                    {r?.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5">
                      <FormField
                        control={form.control}
                        name="barangay"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full">
                            <Label isRequired htmlFor="barangayID">
                              Barangay
                            </Label>
                            <Select
                              onValueChange={field.onChange}
                              disabled={barangayIsLoading ? true : false}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Barangay" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              {form.watch("city") === CITY_OF_MANILA_CODE ? (
                                <SelectContent>
                                  {hasSelectCity &&
                                    brgyOfManila &&
                                    brgyOfManila.map((value: TBrgysManila) => {
                                      return (
                                        <SelectItem
                                          id={value.name}
                                          key={value.name}
                                          value={value.name}
                                        >
                                          {value.name}
                                        </SelectItem>
                                      );
                                    })}
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
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem className="w-[180px] flex flex-col">
                            <Label isRequired htmlFor="zipCode">
                              Zip Code
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                id="zipCode"
                                type="number"
                                placeholder="0000"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value ? parseInt(value) : value
                                  );
                                }}
                                disabled={hasSelectBrgy ? false : true}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
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
                    <Button onClick={handlePreviousStep}>Previous</Button>
                  )}
                  {step === 3 ? (
                    <Button
                      type="submit"
                      //   disabled={!agree ? agree : isSubmitting}
                      variant={
                        !agree || form.formState.isSubmitting
                          ? "disabled"
                          : "default"
                      }
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>Next</Button>
                  )}
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
