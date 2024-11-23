import { z } from "zod";

const letterOnlyRegex = /^[a-zA-Z]+$/;
const numberOnlyRegex = /^\d+$/;
// const addressRegex = /^[a-zA-Z0-9\s,.]+$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:',.<>/?~])[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;:',.<>/?~]{8,}$/;

export const userSchema = z.object({
  userId: z.string().min(1),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .refine((value) => letterOnlyRegex.test(value), {
      message: "Last name should only contain letters",
    }),
  firstName: z
    .string()
    .min(1, "First name is required")
    .refine((value) => letterOnlyRegex.test(value), {
      message: "First name should only contain letters",
    }),
  middleName: z
    .string()
    .optional()
    .default("")
    .refine((value) => letterOnlyRegex.test(value) || value.trim() === "", {
      message: "Middle name should only contain letters",
    }),
  suffix: z
    .string()
    .optional()
    .default("")
    .refine((value) => letterOnlyRegex.test(value) || value.trim() === "", {
      message: "Suffix should only contain letters",
    }),
  birthDay: z.string().min(1, "Birthday is required").date(),
  age: z.number().min(1, "Age is required"),
  sex: z.string().min(1, "Sex is required"),
  email: z.string().min(1, "Email is required").email(),
  mobileNo: z
    .string()
    .refine((value) => /^[0-9]+$/.test(value), {
      message: "Mobile number must be 11 digits and only contain numbers.",
    })
    .refine((value) => numberOnlyRegex.test(value.replace(/\s/g, "")), {
      message: "Invalid phone number",
    })
    .optional(),
  password: z
    .string()
    .min(8, {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    })
    .refine((value) => passwordPattern.test(value), {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    }),
  profilePicUrl: z.string().optional(),
  accountStatus: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  roleIds: z.array(z.string()),
  deleted: z.boolean(),
  civilStatus: z.string().optional(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
  cPassword: z
    .string()
    .min(8, {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    })
    .refine((value) => passwordPattern.test(value), {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    }),
});

export const patientSchema = userSchema.extend({
  patientId: z.string(),
  nickname: z.string(),
  occupation: z.string(),
  address: z.string(),
  barangay: z.string(),
  city: z.string(),
  region: z.string(),
  zipCode: z.number(),
});

export const dentistSchema = userSchema.extend({
  dentistId: z.string(),
  bio: z.string(),
});

export const createPatientSchema = patientSchema.pick({
  email: true,
  password: true,
  cPassword: true,
  mobileNo: true,
  firstName: true,
  middleName: true,
  lastName: true,
  nickname: true,
  birthDay: true,
  sex: true,
  age: true,
  occupation: true,
  religion: true,
  nationality: true,
  civilStatus: true,
  address: true,
  region: true,
  city: true,
  barangay: true,
  zipCode: true,
  roleIds: true,
});

export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});
