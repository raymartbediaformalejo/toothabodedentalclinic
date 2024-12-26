import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import {
  CITY_OF_MANILA_CODE,
  DEFAULT_USER_PROFILE_IMG_URL,
  PEOPLE_PROFILE_IMG_URL,
  RELATIONSHIP,
} from "@/lib/variables";
import {
  useGetAllRegions,
  useGetBarangays,
  useGetProvincesCities,
  useGetUser,
} from "@/service/queries";
import { LuChevronDown } from "react-icons/lu";
import {
  TBrgys,
  TBrgysManila,
  TPatientInfo,
  TProvince,
  TRegion,
  TUser,
} from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import phFlag from "@/assets/phFlag.png";
import brgyOfManila from "@/assets/manilaBrgy.json";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const PatientInfo = () => {
  const [openRegion, setOpenRegion] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openBarangay, setOpenBarangay] = useState(false);
  const { userId } = useAuth();
  const { data } = useGetUser(userId!);
  const userData: TUser = useMemo(() => data?.data[0], [data]);
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<TPatientInfo>();
  const isLovedOne = watch("isLovedOne");
  const region = watch("region");
  const city = watch("city");
  const barangay = watch("barangay");

  const hasSelectRegion = !!region;
  const hasSelectCity = !!city;
  const hasSelectBrgy = !!barangay;
  const { data: regions, isLoading: regionIsLoading } = useGetAllRegions();
  const { data: provincesCities, isLoading: provincesCitiesIsLoading } =
    useGetProvincesCities(`${hasSelectRegion && region.toString()}`);
  const { data: brgys, isLoading: barangayIsLoading } = useGetBarangays(
    `${hasSelectCity && city.toString()}`
  );

  useEffect(() => {
    setValue("nationality", "Filipino");
    setValue("isLovedOne", false);
  }, []);

  useEffect(() => {
    if (!isLovedOne) setValue("relationship", "My self");
  }, [isLovedOne]);

  return (
    <div>
      <div>
        <p className="text-[14px] text-center font-semibold mb-4 text-neutral-800 leading-[160%]">
          Who is this appointment for?
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className={`flex flex-col items-center justify-center select-none cursor-pointer w-[160px]  p-10 shadow-mui-shadow-1 border border-neutral-300 rounded-[8px] transition ${
              isLovedOne === false
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300"
            }`}
            onClick={() => setValue("isLovedOne", false)}
          >
            <img
              src={
                userData?.profilePicUrl
                  ? userData?.profilePicUrl
                  : DEFAULT_USER_PROFILE_IMG_URL
              }
              className=" overflow-hidden object-cover w-full max-w-[50px] max-h-[50px] h-full border rounded-full border-neutral-300 bg-neutral-100"
            />
            <span
              className={cn(
                "text-sm font-semibold",
                isLovedOne === false ? "text-primary-700" : "text-neutral-600"
              )}
            >
              My self
            </span>
          </button>
          <button
            type="button"
            className={`flex flex-col w-[160px] items-center justify-center select-none cursor-pointer p-10 shadow-mui-shadow-1 border border-neutral-300 rounded-[8px] transition ${
              isLovedOne === true
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300"
            }`}
            onClick={() => setValue("isLovedOne", true)}
          >
            <img
              src={PEOPLE_PROFILE_IMG_URL}
              className=" overflow-hidden object-cover w-full max-w-[50px] max-h-[50px] h-full border rounded-full border-neutral-300 bg-neutral-100"
            />
            <span
              className={cn(
                "text-sm font-semibold whitespace-nowrap",
                isLovedOne === true ? "text-primary-700" : "text-neutral-600"
              )}
            >
              For someone else
            </span>
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-neutral-600 ">Basic Information</h3>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("firstName").name}>
              {isLovedOne ? "Patient's first name" : "First name"}
            </Label>
            <Input
              {...register("firstName")}
              id={register("firstName").name}
              onBlur={() => register("firstName")}
              placeholder={
                isLovedOne
                  ? "Enter patient's first name"
                  : "Enter your first name"
              }
            />
            {errors.firstName && (
              <span className="text-sm text-destructive">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label isOptional htmlFor={register("middleName").name}>
              {isLovedOne ? "Patient's middle name" : "Middle name"}
            </Label>
            <Input
              id={register("middleName").name}
              {...register("middleName")}
              placeholder={
                isLovedOne
                  ? "Enter patient's middle name"
                  : "Enter your middle name"
              }
            />
            {errors.middleName && (
              <span className="text-sm text-destructive">
                {errors.middleName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("lastName").name}>
              {isLovedOne ? "Patient's last name" : "Last name"}
            </Label>
            <Input
              id={register("lastName").name}
              {...register("lastName")}
              placeholder={
                isLovedOne
                  ? "Enter patient's last name"
                  : "Enter your last name"
              }
            />
            {errors.lastName && (
              <span className="text-sm text-destructive">
                {errors.lastName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={register("nickname").name}>
              {isLovedOne ? "Patient's nickname" : "Nickname"}
            </Label>
            <Input
              id={register("nickname").name}
              {...register("nickname")}
              placeholder={
                isLovedOne ? "Enter patient's nickname" : "Enter your nickname"
              }
            />
            {errors.nickname && (
              <span className="text-sm text-destructive">
                {errors.nickname.message}
              </span>
            )}
          </div>
          {isLovedOne ? (
            <div className="flex flex-col gap-1">
              <Label htmlFor={register("relationship").name}>
                Relationship to patient
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("relationship", value);
                  trigger("relationship");
                }}
              >
                <SelectTrigger onBlur={register("relationship").onBlur}>
                  <SelectValue placeholder="Select relationship to patient" />
                </SelectTrigger>
                {errors.relationship && (
                  <span className="text-sm text-destructive">
                    {errors.relationship.message}
                  </span>
                )}
                <SelectContent>
                  {RELATIONSHIP.map(({ value, label }) => (
                    <SelectItem id={value} key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </div>
      <Separator className="mt-12" />
      <div className="mt-9">
        <h3 className="font-semibold text-neutral-600 ">Demographics:</h3>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("birthDay").name}>
              Birthday
            </Label>
            <Input
              id={register("birthDay").name}
              {...register("birthDay")}
              type="date"
            />
            {errors.birthDay && (
              <span className="text-sm text-destructive">
                {errors.birthDay.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("age").name}>
              Age
            </Label>
            <Input
              {...register("age")}
              id={register("age").name}
              type="number"
              placeholder={
                isLovedOne ? "Enter patient's age" : "Enter your age"
              }
            />
            {errors.age && (
              <span className="text-sm text-destructive">
                {errors.age.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("sex").name}>
              Sex
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("sex", value);
                trigger("sex");
              }}
            >
              <SelectTrigger
                {...register("sex")}
                onBlur={register("sex").onBlur}
              >
                <SelectValue
                  placeholder={
                    isLovedOne ? "Select patient's sex" : "Select sex"
                  }
                />
              </SelectTrigger>
              {errors.sex && (
                <span className="text-sm text-destructive">
                  {errors.sex.message}
                </span>
              )}
              <SelectContent>
                <SelectItem id="Male" key="Male" value="Male">
                  Male
                </SelectItem>
                <SelectItem id="Female" key="Female" value="Female">
                  Female
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={register("occupation").name}>Occupation</Label>
            <Input
              id={register("occupation").name}
              {...register("occupation")}
              placeholder={
                isLovedOne
                  ? "Enter patient's occupation"
                  : "Enter your occupation"
              }
            />
            {errors.occupation && (
              <span className="text-sm text-destructive">
                {errors.occupation.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={register("religion").name}>Religion</Label>
            <Input
              id={register("religion").name}
              {...register("religion")}
              placeholder={
                isLovedOne ? "Enter patient's religion" : "Enter your religion"
              }
            />
            {errors.religion && (
              <span className="text-sm text-destructive">
                {errors.religion.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={register("nationality").name}>Nationality</Label>
            <Input
              id={register("nationality").name}
              {...register("nationality")}
              placeholder={
                isLovedOne
                  ? "Enter patient's nationality"
                  : "Enter your nationality"
              }
            />
            {errors.nationality && (
              <span className="text-sm text-destructive">
                {errors.nationality.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <Separator className="mt-12" />
      <div className="mt-12">
        <h3 className="font-semibold text-neutral-600">Contact Details:</h3>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("email").name}>
              Email
            </Label>
            <Input
              id={register("email").name}
              {...register("email")}
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-sm text-destructive">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("mobileNo").name}>
              Mobile no
            </Label>
            <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5">
              <div className="shrink-0 font-inter flex items-center rounded-[3.02px] md:rounded-[4.42px] gap-1 lg:rounded-[5px] border-black/50 border-[0.6px] md:border-[0.88px] lg:border-[1px] px-4 md:px-4 lg:px-4 py-3 md:py-3 lg:py-3 text-xs md:text-sm ">
                <img className="h-[15px] w-[30px]" src={phFlag} alt="ph flag" />
                <span className="text-black/50">+ 63</span>
              </div>
              <div className="w-full">
                <Input
                  {...register("mobileNo")}
                  id={register("mobileNo").name}
                  type="tel"
                  placeholder={
                    isLovedOne ? "Select patient's number" : "Enter your number"
                  }
                />
              </div>
            </div>

            {errors.mobileNo && (
              <span className="text-sm text-destructive">
                {errors.mobileNo.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <Separator className="mt-12" />
      <div className="mt-12">
        <h3 className="font-semibold text-neutral-600">Address:</h3>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("address").name}>
              Address
            </Label>
            <Input
              id={register("address").name}
              {...register("address")}
              placeholder={
                isLovedOne ? "Enter patient's address" : "Enter your address"
              }
            />
            {errors.address && (
              <span className="text-sm text-destructive">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("region").name}>
              Region
            </Label>
            <Popover open={openRegion} onOpenChange={setOpenRegion}>
              <PopoverTrigger>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={openRegion}
                  disabled={regionIsLoading ? true : false}
                  className="relative group flex items-center h-[50px] justify-start w-full text-sm border duration-200 ease-in-out rounded-md trasition-[border-color] hover:border-primary-700 border-neutral-300 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-5 py-1"
                >
                  {region
                    ? regions?.data.find(
                        (value: TRegion) => value.name === region
                      )?.name
                    : regionIsLoading
                    ? "Loading region..."
                    : "Select region"}
                  <LuChevronDown className="absolute h-5 w-5 group-hover:opacity-75 transition-[opacity] ease-in-out duration-200 top-[50%] right-4 opacity-40 translate-y-[-50%]" />
                </button>
              </PopoverTrigger>
              {errors.region && (
                <span className="text-sm text-destructive">
                  {errors.region.message}
                </span>
              )}
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search city/province..." />
                  <CommandList>
                    <CommandEmpty>
                      {regionIsLoading ? "Loading region..." : "No region"}
                    </CommandEmpty>
                    <CommandGroup>
                      {regions?.data &&
                        regions?.data.map((value: TRegion) => (
                          <CommandItem
                            key={value.code}
                            id={value.code}
                            value={value.name}
                            onSelect={(value) => {
                              setValue("region", value);
                              trigger("region");
                              setOpenRegion((prev) => !prev);
                            }}
                          >
                            {value.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("city").name}>
              City/Province
            </Label>
            <Popover open={openCity} onOpenChange={setOpenCity}>
              <PopoverTrigger>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={openCity}
                  disabled={provincesCitiesIsLoading ? true : false}
                  className="relative group flex items-center h-[50px] justify-start w-full text-sm border duration-200 ease-in-out rounded-md trasition-[border-color] hover:border-primary-700 border-neutral-300 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-5 py-1"
                >
                  {city
                    ? provincesCities?.data.find(
                        (value: TProvince) => value.name === city
                      )?.name
                    : provincesCitiesIsLoading
                    ? "Loading city/province..."
                    : "Select city"}
                  <LuChevronDown className="absolute h-5 w-5 group-hover:opacity-75 transition-[opacity] ease-in-out duration-200 top-[50%] right-4 opacity-40 translate-y-[-50%]" />
                </button>
              </PopoverTrigger>
              {errors.city && (
                <span className="text-sm text-destructive">
                  {errors.city.message}
                </span>
              )}
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search city/province..." />
                  <CommandList>
                    <CommandEmpty>
                      {provincesCitiesIsLoading
                        ? "Loading city/province..."
                        : "No city"}
                    </CommandEmpty>
                    <CommandGroup>
                      {hasSelectRegion &&
                        provincesCities?.data &&
                        provincesCities?.data.map((value: TProvince) => (
                          <CommandItem
                            key={value.code}
                            id={value.code}
                            value={value.name}
                            onSelect={(value) => {
                              setValue("city", value);
                              trigger("city");
                              setOpenCity((prev) => !prev);
                            }}
                          >
                            {value.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("barangay").name}>
              Barangay
            </Label>
            <Popover open={openBarangay} onOpenChange={setOpenBarangay}>
              <PopoverTrigger>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={openBarangay}
                  disabled={!hasSelectCity && barangayIsLoading ? true : false}
                  className="relative group flex items-center h-[50px] justify-start w-full text-sm border duration-200 ease-in-out rounded-md trasition-[border-color] hover:border-primary-700 border-neutral-300 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-5 py-1"
                >
                  {city === CITY_OF_MANILA_CODE
                    ? brgyOfManila?.find(
                        (value: TBrgysManila) => value.name === barangay
                      )?.name
                    : brgys
                    ? brgys?.data?.find(
                        (value: TBrgys) => value.name === barangay
                      )?.name
                    : barangayIsLoading
                    ? "Loading barangay..."
                    : "Select barangay"}
                  <LuChevronDown className="absolute h-5 w-5 group-hover:opacity-75 transition-[opacity] ease-in-out duration-200 top-[50%] right-4 opacity-40 translate-y-[-50%]" />
                </button>
              </PopoverTrigger>
              {errors.barangay && (
                <span className="text-sm text-destructive">
                  {errors.barangay.message}
                </span>
              )}
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search barangay..." />
                  <CommandList>
                    <CommandEmpty>No barangay</CommandEmpty>
                    <CommandGroup>
                      {city === CITY_OF_MANILA_CODE
                        ? brgyOfManila?.map((value: TBrgysManila) => (
                            <CommandItem
                              value={value.name}
                              key={value.name}
                              id={value.name}
                              onSelect={(value) => {
                                setValue("barangay", value);
                                trigger("barangay");
                                setOpenBarangay((prev) => !prev);
                              }}
                            >
                              {value.name}
                            </CommandItem>
                          ))
                        : brgys?.data?.map((value: TBrgys) => (
                            <CommandItem
                              value={value.name}
                              key={value.code}
                              id={value.code}
                              onSelect={(value) => {
                                setValue("barangay", value);
                                trigger("barangay");
                                setOpenBarangay((prev) => !prev);
                              }}
                            >
                              {value.name}
                            </CommandItem>
                          ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1">
            <Label isRequired htmlFor={register("zipCode").name}>
              Zip code
            </Label>
            <Input
              id={register("zipCode").name}
              {...register("zipCode")}
              placeholder="0000"
              type="number"
              disabled={hasSelectBrgy ? false : true}
            />
            {errors.zipCode && (
              <span className="text-sm text-destructive">
                {errors.zipCode.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
