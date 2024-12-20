import { z } from "zod";

const letterOnlyRegex = /^[a-zA-Z]+$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:',.<>/?~])[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;:',.<>/?~]{8,}$/;

export const userSchema = z.object({
  id: z.string().min(1),
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
  middleName: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  birthDay: z.string().min(1, "Birthday is required").date(),
  age: z.number().min(1, "Age is required"),
  sex: z.string().min(1, "Sex is required"),
  email: z.string().min(1, "Email is required").email(),
  mobileNo: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => /^[0-9]+$/.test(value), {
      message: "Mobile number must contain only numbers.",
    })
    .refine((value) => value.length === 10 || value.length === 11, {
      message: "Mobile number must be 10 or 11 digits long.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .refine((value) => passwordPattern.test(value), {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    })
    .optional(),
  cPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .refine((value) => passwordPattern.test(value), {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    })
    .optional(),
  newPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .refine((value) => passwordPattern.test(value), {
      message:
        "Password must start with an uppercase letter, include lowercase letters, numbers, and special characters, and be at least 8 characters long",
    })
    .optional(),
  profilePicUrl: z.string().optional().nullable(),
  accountStatus: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  roleIds: z.array(z.string()).min(1, "Role is required"),
  deleted: z.boolean(),
  civilStatus: z.string().optional(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

export const patientSchema = userSchema.extend({
  patientId: z.string(),
  nickname: z.string().min(1, "Nickname is required"),
  occupation: z.string().min(1, "Occupation is required"),
  address: z.string(),
  barangay: z.string(),
  city: z.string(),
  region: z.string(),
  zipCode: z.number(),
});

export const createPatientSchema = patientSchema
  .pick({
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
  })
  .refine((data) => data.password === data.cPassword, {
    message: "Password do not mathch.",
    path: ["cPassword"],
  });

export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});

// ============ || SERVICE || ===========

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  orderNo: z.number().optional(),
  visible: z.boolean(),
  deleted: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

export const createServiceSchema = serviceSchema.pick({
  title: true,
  description: true,
  visible: true,
  createdBy: true,
});

export const editServiceSchema = serviceSchema.pick({
  id: true,
  title: true,
  description: true,
  orderNo: true,
  visible: true,
  updatedBy: true,
});

export const deleteServiceSchema = serviceSchema.pick({
  id: true,
  title: true,
});

export const saveSortedServiceSchema = serviceSchema.pick({
  id: true,
  title: true,
});

// ============ || DENTIST || ===========

export const dentistSchema = userSchema.extend({
  sunday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  monday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  tuesday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  wednesday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  thursday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  friday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  saturday: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  services: z.array(z.string()),
});

export const createDentistSchema = dentistSchema.pick({
  lastName: true,
  firstName: true,
  middleName: true,
  email: true,
  suffix: true,
  password: true,
  profilePicUrl: true,
  roleIds: true,
  services: true,
  createdBy: true,
  sunday: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
});

export const editDentistSchema = dentistSchema.pick({
  id: true,
  lastName: true,
  firstName: true,
  middleName: true,
  suffix: true,
  email: true,
  profilePicUrl: true,
  roleIds: true,
  services: true,
  updatedBy: true,
  sunday: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
});

export const deleteDentistSchema = dentistSchema.pick({
  id: true,
  lastName: true,
  firstName: true,
  middleName: true,
});

export const saveSortedDentistSchema = dentistSchema.pick({
  id: true,
  lastName: true,
  firstName: true,
  middleName: true,
});

export const changePasswordSchema = dentistSchema
  .pick({
    id: true,
    password: true,
    newPassword: true,
    cPassword: true,
  })
  .refine((data) => data.newPassword === data.cPassword, {
    message: "Password do not mathch.",
    path: ["cPassword"],
  });
