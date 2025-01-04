import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import H1 from "@/components/ui/H1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { DEFAULT_USER_PROFILE_IMG_URL } from "@/lib/variables";
import { useEditUser } from "@/service/mutation";
import { useGetUser } from "@/service/queries";
import { editUserSchema } from "@/types/schema";
import { TEditUser, TUser } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import ChangePassword from "./components/ChangePassword";

const MyAccount = () => {
  const { userId } = useAuth();
  const { data, isFetched } = useGetUser(userId!);
  const user: TUser | undefined = data?.data;
  const editUser = useEditUser();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const form = useForm<TEditUser>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      profilePicUrl: "",
      updatedBy: "",
    },
  });
  useEffect(() => {
    if (form.watch("profilePicUrl"))
      setImagePreview(form.watch("profilePicUrl")!);
  }, [form]);
  useEffect(() => {
    if (userId) form.setValue("id", userId);
    if (userId) form.setValue("updatedBy", userId);
    if (isFetched && user) {
      form.setValue("firstName", user.firstName);
      form.setValue("middleName", user.middleName);
      form.setValue("lastName", user.lastName);
      form.setValue("suffix", user.suffix);
      form.setValue("profilePicUrl", user.profilePicUrl);
    }
  }, [
    form,
    userId,
    user,
    user?.firstName,
    user?.middleName,
    user?.lastName,
    user?.suffix,
    user?.email,
    user?.profilePicUrl,
    user?.roleIds,
    isFetched,
  ]);

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

  const handleEditUser: SubmitHandler<TEditUser> = async (data) => {
    try {
      if (imageFile) {
        console.log("UPLOADING TO CLOUDINARY");
        const imageUrl = await uploadToCloudinary(imageFile);
        data.profilePicUrl = imageUrl;
      }

      await editUser.mutate(data);
    } catch (error) {
      console.error("Failed to submit user data:", error);
    }
  };

  return (
    <div>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1 className="">
          My <span className="text-primary-700">Account</span>
        </H1>
      </header>
      <div className="relative mx-4 my-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditUser)}
            className="flex flex-col justify-between h-full"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col justify-center w-full gap-6 my-4 md:flex-row ">
                <div className="relative flex flex-col items-center gap-4 mb-10">
                  <div className="relative flex">
                    <div className=" border self-center shadow-mui-shadow-1 rounded-full overflow-hidden select-none h-[150px] w-[150px]">
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
                          <FormItem className="absolute bg-neutral-600 p-2 rounded-full outline-white outline bottom-[2px] right-[10px]  flex flex-col hover:bg-neutral-500 trasition-[background-color] duration-200 ease-in-out">
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
                </div>
                <div className=" md:max-w-[50%]  md:w-[360px] justify-center flex flex-col gap-5">
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
                </div>
              </div>
            </div>

            <div className="flex content-end justify-center gap-3 mt-10 ">
              <Button type="button" asChild variant="db_outline" size="lg">
                <Link to="/">Cancel</Link>
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
                Edit profile
              </Button>
            </div>
          </form>
        </Form>

        <div className="absolute top-[180px] left-[50%] md:left-[calc(50%-192px)]  translate-x-[-50%]">
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
