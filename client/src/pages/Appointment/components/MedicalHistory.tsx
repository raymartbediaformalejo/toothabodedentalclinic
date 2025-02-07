import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FEMALE } from "@/lib/variables";

import { TMedicalHistory } from "@/types/types";
import { useFormContext } from "react-hook-form";
import phFlag from "@/assets/phFlag.png";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type TMedicalHistoryProps = {
  sex: string;
};

const MedicalHistory = ({ sex }: TMedicalHistoryProps) => {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<TMedicalHistory>();

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex  flex-col gap-6 w-full max-w-[400px]">
          <div>
            <Label isOptional htmlFor={register("physicianName").name}>
              Name of Physician:
            </Label>
            <Input
              id={register("physicianName").name}
              {...register("physicianName")}
              placeholder="Enter physician name"
            />
            {errors.physicianName && (
              <span className="text-sm text-destructive">
                {errors.physicianName.message}
              </span>
            )}
          </div>

          <div>
            <Label isOptional htmlFor={register("physicianMobileNo").name}>
              Physician mobile no
            </Label>
            <div className="flex gap-[12.08px] md:gap-[17.68px] lg:gap-5">
              <div className="shrink-0 font-inter flex items-center rounded-[3.02px] md:rounded-[4.42px] gap-1 lg:rounded-[5px] border-black/50 border-[0.6px] md:border-[0.88px] lg:border-[1px] px-4 md:px-4 lg:px-4 py-3 md:py-3 lg:py-3 text-xs md:text-sm ">
                <img className="h-[15px] w-[30px]" src={phFlag} alt="ph flag" />
                <span className="text-black/50">+ 63</span>
              </div>
              <div className="w-full">
                <Input
                  {...register("physicianMobileNo")}
                  id={register("physicianMobileNo").name}
                  type="tel"
                  placeholder="000 - 000 - 0000"
                />
              </div>
            </div>

            {errors.physicianMobileNo && (
              <span className="text-sm text-destructive">
                {errors.physicianMobileNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="mt-6">
              <div className="flex gap-1 mt-1">
                <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                  1. Are you in Good Health?
                </p>
                <span className="text-red-500">*</span>
                {errors.question1 && (
                  <span className="text-sm text-destructive">
                    {errors.question1.message}
                  </span>
                )}
              </div>
              <RadioGroup
                onValueChange={(value) => {
                  setValue("question1", value);
                  trigger("question1");
                }}
                value={watch("question1")}
                className="mt-1 ml-4"
              >
                <div className="flex items-center gap-[6px] select-none">
                  <RadioGroupItem
                    value="true"
                    id="1a"
                    className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                  />
                  <Label htmlFor="1a" className="text-[14px]">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-[6px] select-none">
                  <RadioGroupItem
                    value="false"
                    id="1b"
                    className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                  />
                  <Label htmlFor="1b" className="text-[14px]">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div>
                <div className="flex gap-1">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    2. Are you under medical treatment now?
                  </p>
                  <span className="text-red-500">*</span>
                  {errors.question2 && (
                    <span className="text-sm text-destructive">
                      {errors.question2.message}
                    </span>
                  )}
                </div>
                <RadioGroup
                  value={watch("question2.answer")}
                  onValueChange={(value) => {
                    setValue("question2.answer", value);
                    trigger("question2");
                  }}
                  className="mt-1 ml-4"
                >
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="true"
                      id="2a"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="2a" className="text-[14px]">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="false"
                      id="2b"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="2b" className="text-[14px]">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {watch("question2.answer") === "true" ? (
                <div className="ml-4">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    a. if so, what is the condition being treated?
                  </p>
                  <Textarea
                    {...register("question2.subAnswer")}
                    id={register("question2.subAnswer").name}
                    placeholder="Type here..."
                    className="max-w-80"
                    onChange={register("question2.subAnswer").onChange}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <div>
                <div className="flex gap-1">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    3. Have you ever had serious illness or surgical operation?
                  </p>
                  <span className="text-red-500">*</span>
                  {errors.question3 && (
                    <span className="text-sm text-destructive">
                      {errors.question3.message}
                    </span>
                  )}
                </div>
                <RadioGroup
                  value={watch("question3.answer")}
                  onValueChange={(value) => {
                    setValue("question3.answer", value);
                    trigger("question3");
                  }}
                  className="mt-1 ml-4"
                >
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="true"
                      id="3a"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="3a" className="text-[14px]">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="false"
                      id="3b"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="3b" className="text-[14px]">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {watch("question3.answer") === "true" ? (
                <div className="ml-4">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    a. if so, what illness or operations?
                  </p>
                  <Textarea
                    {...register("question3.subAnswer")}
                    id={register("question3.subAnswer").name}
                    placeholder="Type here..."
                    className="max-w-80"
                    onChange={register("question3.subAnswer").onChange}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <div>
                <div className="flex gap-1">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    4. Have you ever been hospitalized?
                  </p>
                  <span className="text-red-500">*</span>
                  {errors.question4 && (
                    <span className="text-sm text-destructive">
                      {errors.question4.message}
                    </span>
                  )}
                </div>
                <RadioGroup
                  value={watch("question4.answer")}
                  onValueChange={(value) => {
                    setValue("question4.answer", value);
                    trigger("question4");
                  }}
                  className="mt-1 ml-4"
                >
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="true"
                      id="4a"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="4a" className="text-[14px]">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="false"
                      id="4b"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="4b" className="text-[14px]">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {watch("question4.answer") === "true" ? (
                <div className="ml-4">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    a. if so, when and why?
                  </p>
                  <Textarea
                    {...register("question4.subAnswer")}
                    id={register("question4.subAnswer").name}
                    placeholder="Type here..."
                    className="max-w-80"
                    onChange={register("question4.subAnswer").onChange}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <div>
                <div className="flex gap-1">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    5. Are you taking any prescription/non-prescription
                    medication?
                  </p>
                  <span className="text-red-500">*</span>
                  {errors.question5 && (
                    <span className="text-sm text-destructive">
                      {errors.question5.message}
                    </span>
                  )}
                </div>
                <RadioGroup
                  value={watch("question5.answer")}
                  onValueChange={(value) => {
                    setValue("question5.answer", value);
                    trigger("question5");
                  }}
                  className="mt-1 ml-4"
                >
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="true"
                      id="5a"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="5a" className="text-[14px]">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center gap-[6px] select-none">
                    <RadioGroupItem
                      value="false"
                      id="5b"
                      className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                    />
                    <Label htmlFor="5b" className="text-[14px]">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {watch("question5.answer") === "true" ? (
                <div className="ml-4">
                  <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                    a. if so, when and why?
                  </p>
                  <Textarea
                    {...register("question5.subAnswer")}
                    id={register("question5.subAnswer").name}
                    placeholder="Type here..."
                    className="max-w-80"
                    onChange={register("question5.subAnswer").onChange}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <div className="flex gap-1">
                <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                  6. Do you use tobacco products/smoke?
                </p>
                <span className="text-red-500">*</span>
                {errors.question6 && (
                  <span className="text-sm text-destructive">
                    {errors.question6.message}
                  </span>
                )}
              </div>
              <RadioGroup
                value={watch("question6")}
                onValueChange={(value) => {
                  setValue("question6", value);
                  trigger("question6");
                }}
                className="mt-1 ml-4"
              >
                <div className="flex items-center gap-[6px] select-none">
                  <RadioGroupItem
                    value="true"
                    id="6a"
                    className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                  />
                  <Label htmlFor="6a" className="text-[14px]">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-[6px] select-none">
                  <RadioGroupItem
                    value="false"
                    id="6b"
                    className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                  />
                  <Label htmlFor="6b" className="text-[14px]">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex gap-1">
                <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                  7. Do you use alcohol, cocaine or other dangerous drugs?
                </p>
                <span className="text-red-500">*</span>
                {errors.question7 && (
                  <span className="text-sm text-destructive">
                    {errors.question7.message}
                  </span>
                )}
              </div>
              <RadioGroup
                value={watch("question7")}
                onValueChange={(value) => {
                  setValue("question7", value);
                  trigger("question7");
                }}
                className="mt-1 ml-4"
              >
                <div className="flex items-center gap-[6px] select-none">
                  <RadioGroupItem
                    value="true"
                    id="7a"
                    className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                  />
                  <Label htmlFor="7a" className="text-[14px]">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-[6px] select-none">
                  <RadioGroupItem
                    value="false"
                    id="7b"
                    className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                  />
                  <Label htmlFor="7b" className="text-[14px]">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div>
                <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                  8. Are you allergic to any of the following:
                </p>
                <div className="flex flex-col gap-2 mt-1 ml-4">
                  <div className="flex items-center gap-4 ">
                    <p className="text-neutral-600 text-[14px] ">
                      a. Local Anesthetic drug
                    </p>
                    <Checkbox
                      checked={
                        watch("question8.localAnestheticDrug") as boolean
                      }
                      onCheckedChange={(value) =>
                        setValue(
                          "question8.localAnestheticDrug",
                          value as boolean
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4 ">
                    <p className="text-neutral-600 text-[14px] ">
                      b. Penicillin
                    </p>
                    <Checkbox
                      checked={watch("question8.penicillin") as boolean}
                      onCheckedChange={(value) =>
                        setValue("question8.penicillin", value as boolean)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4 ">
                    <p className="text-neutral-600 text-[14px] ">
                      c. Sulfa drugs
                    </p>
                    <Checkbox
                      checked={watch("question8.sulfaDrugs") as boolean}
                      onCheckedChange={(value) =>
                        setValue("question8.sulfaDrugs", value as boolean)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4 ">
                    <p className="text-neutral-600 text-[14px] ">d. Aspirin</p>
                    <Checkbox
                      checked={watch("question8.aspirin") as boolean}
                      onCheckedChange={(value) =>
                        setValue("question8.aspirin", value as boolean)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4 ">
                    <p className="text-neutral-600 text-[14px] ">e. Latex</p>
                    <Checkbox
                      checked={watch("question8.latex") as boolean}
                      onCheckedChange={(value) =>
                        setValue("question8.latex", value as boolean)
                      }
                    />
                  </div>
                  <div className="items-center gap-4 ">
                    <p className="text-neutral-600 text-[14px] ">f. Others</p>
                    <Textarea
                      {...register("question8.others")}
                      id={register("question8.others").name}
                      placeholder="Type here..."
                      className="mt-1 ml-3 max-w-80"
                    />
                  </div>
                </div>
              </div>
            </div>

            {sex === FEMALE ? (
              <div>
                <div>
                  <div className="flex gap-1">
                    <p className="text-[14px] text-neutral-600 leading-[28.8px]">
                      9. For woman only:
                    </p>
                    <span className="text-red-500">*</span>
                    {errors.question9 && (
                      <span className="text-sm text-destructive">
                        {errors.question9.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 mt-1 ml-4">
                    <div>
                      <p className="text-neutral-600 text-[14px] ">
                        a. Are you pregnant?
                      </p>
                      <RadioGroup
                        value={watch("question9.areYouPregnant")}
                        onValueChange={(value) =>
                          setValue("question9.areYouPregnant", value)
                        }
                        className="mt-1 ml-4"
                      >
                        <div className="flex items-center gap-[6px] select-none">
                          <RadioGroupItem
                            value="true"
                            id="9a1"
                            className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                          />
                          <Label htmlFor="9a1" className="text-[14px]">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-[6px] select-none">
                          <RadioGroupItem
                            value="false"
                            id="9a2"
                            className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                          />
                          <Label htmlFor="9a2" className="text-[14px]">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-[14px] ">
                        b. Are you currently nursing?
                      </p>
                      <RadioGroup
                        value={watch("question9.areYouCurrentlyNursing")}
                        onValueChange={(value) =>
                          setValue("question9.areYouCurrentlyNursing", value)
                        }
                        className="mt-1 ml-4"
                      >
                        <div className="flex items-center gap-[6px] select-none">
                          <RadioGroupItem
                            value="true"
                            id="9b1"
                            className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                          />
                          <Label htmlFor="9b1" className="text-[14px]">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-[6px] select-none">
                          <RadioGroupItem
                            value="false"
                            id="9b2"
                            className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                          />
                          <Label htmlFor="9b2" className="text-[14px]">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-[14px] ">
                        c. Are you taking birth control pills?
                      </p>
                      <RadioGroup
                        value={watch("question9.areYouTakingBirthControlPills")}
                        onValueChange={(value) =>
                          setValue(
                            "question9.areYouTakingBirthControlPills",
                            value
                          )
                        }
                        className="mt-1 ml-4"
                      >
                        <div className="flex items-center gap-[6px] select-none">
                          <RadioGroupItem
                            value="true"
                            id="9c1"
                            className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                          />
                          <Label htmlFor="9c1" className="text-[14px]">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-[6px] select-none">
                          <RadioGroupItem
                            value="false"
                            id="9c2"
                            className="border-neutral-600 text-white [&_svg]:fill-neutral-600"
                          />
                          <Label htmlFor="9c2" className="text-[14px]">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
