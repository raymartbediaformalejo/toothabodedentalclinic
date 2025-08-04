import { z } from "zod";

const letterOnlyRegex = /^[a-zA-Z\s]+$/;
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
  age: z.string().min(1, "Age is required"),
  sex: z.string().min(1, "Sex is required"),
  email: z.string().min(1, "Email is required").email(),
  mobileNo: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => /^[0-9]+$/.test(value), {
      message: "Invalid mobile number",
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
  nickname: z.string().min(1, "Nickname is required"),
  occupation: z.string().min(1, "Occupation is required"),
  address: z.string(),
  barangay: z.string(),
  city: z.string(),
  region: z.string(),
  zipCode: z.number(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

export const createPatientSchema = userSchema
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

export const loginUserSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const editUserSchema = userSchema.pick({
  id: true,
  firstName: true,
  middleName: true,
  lastName: true,
  suffix: true,
  profilePicUrl: true,
  updatedBy: true,
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

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

export const userWithRoleSchema = userSchema
  .pick({
    id: true,
    lastName: true,
    firstName: true,
    middleName: true,
    suffix: true,
    birthDay: true,
    age: true,
    sex: true,
    email: true,
    mobileNo: true,
    profilePicUrl: true,
    accountStatus: true,
    nationality: true,
    religion: true,
    nickname: true,
    occupation: true,
    address: true,
    barangay: true,
    city: true,
    region: true,
    zipCode: true,
    civilStatus: true,
    createdBy: true,
    createdAt: true,
    updatedBy: true,
    updatedAt: true,
  })
  .extend({ roles: z.array(z.string()), isVerified: z.boolean() });

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

// APPOINTMENT

export const appointmentSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  appointmentPatientInfoId: z.string(),
  dentistId: z.string(),
  serviceIds: z.array(z.string().min(1, "Service is required.")),
  schedule: z.string().min(1, "Schedule is required."),
  appointmentStatus: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

export const appointmentPatientInfoSchema = userSchema
  .pick({
    firstName: true,
    middleName: true,
    lastName: true,
    birthDay: true,
    age: true,
    sex: true,
    email: true,
    mobileNo: true,
    religion: true,
    nationality: true,
  })
  .extend({
    id: z.string(),
    medicalHistoryId: z.string(),
    nickname: z.string(),
    occupation: z.string(),
    address: z.string(),
    city: z.string(),
    barangay: z.string(),
    region: z.string(),
    zipCode: z.string(),
    religion: z.string(),
    isLoveOnes: z.boolean(),
    relationship: z.string().optional().nullable(),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string(),
    updatedBy: z.string(),
  });

export const appointmentInfoSchema = z.object({
  patientId: z.string(),
  serviceIds: z.string().array(),
  dentistId: z.string().min(1, "Please select your dentist."),
});

export const requestDateTimeSchema = z.object({
  date: z.string().min(1, "Date required."),
  time: z.string().min(1, "Time required"),
});

export const requestDateTimeWithIdSchema = z.object({
  appointmentId: z.string().min(1, "Required appointment id"),
  date: z.string().min(1, "Date required."),
  time: z.string().min(1, "Time required"),
});

export const patientInfoSchema = userSchema
  .pick({
    firstName: true,
    middleName: true,
    lastName: true,
    suffix: true,
    birthDay: true,
    age: true,
    religion: true,
    nationality: true,
    email: true,
    mobileNo: true,
  })
  .extend({
    id: z.string().optional().nullable(),
    medicalHistoryId: z.string().optional().nullable(),
    isLovedOne: z.boolean(),
    relationship: z.string().min(1, "Reqiured"),
    nickname: z.string(),
    sex: z.string().min(1, "Required sex"),
    occupation: z.string(),
    address: z.string().min(1, "Adress required"),
    city: z.string().min(1, "City/province required"),
    barangay: z.string().min(1, "Barangay required"),
    region: z.string().min(1, "Region required"),
    zipCode: z.string().min(1, "Zip code required"),
    createdAt: z.string().optional().nullable(),
    createdBy: z.string().optional().nullable(),
  });

export const patientInfoWithIdSchema = patientInfoSchema
  .pick({
    firstName: true,
    middleName: true,
    lastName: true,
    birthDay: true,
    age: true,
    religion: true,
    nationality: true,
    email: true,
    mobileNo: true,
    isLovedOne: true,
    relationship: true,
    nickname: true,
    sex: true,
    occupation: true,
    address: true,
    city: true,
    barangay: true,
    region: true,
    zipCode: true,
  })
  .extend({
    id: z.string(),
    medicalHistoryId: z.string(),
    createdAt: z.string().optional().nullable(),
    createdBy: z.string().optional().nullable(),
    updateAt: z.string().optional().nullable(),
    updatedBy: z.string().optional().nullable(),
  });

export const medicalHistorySchema = z.object({
  physicianName: z.string().optional(),
  physicianMobileNo: z.string().optional(),
  question1: z.string().min(1, "Required"),
  question2: z
    .object({
      answer: z.string().min(1, "Required"),
      subAnswer: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.answer === "true") {
          return !!data.subAnswer;
        }
        return true;
      },
      {
        message: "Required",
        path: ["subAnswer"],
      }
    ),
  question3: z
    .object({
      answer: z.string().min(1, "Required"),
      subAnswer: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.answer === "true") {
          return !!data.subAnswer;
        }
        return true;
      },
      {
        message: "Sub-answer is required if answer is true",
        path: ["subAnswer"],
      }
    ),
  question4: z
    .object({
      answer: z.string().min(1, "Required"),
      subAnswer: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.answer === "true") {
          return !!data.subAnswer;
        }
        return true;
      },
      {
        message: "Required",
        path: ["subAnswer"],
      }
    ),
  question5: z
    .object({
      answer: z.string().min(1, "Required"),
      subAnswer: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.answer === "true") {
          return !!data.subAnswer;
        }
        return true;
      },
      {
        message: "Required",
        path: ["subAnswer"],
      }
    ),
  question6: z.string().min(1, "Required"),
  question7: z.string().min(1, "Required"),
  question8: z.object({
    localAnestheticDrug: z.boolean().optional().nullable(),
    penicillin: z.boolean().optional().nullable(),
    sulfaDrugs: z.boolean().optional().nullable(),
    aspirin: z.boolean().optional().nullable(),
    latex: z.boolean().optional().nullable(),
    others: z.string().optional().nullable(),
  }),
  question9: z
    .object({
      areYouPregnant: z.string(),
      areYouCurrentlyNursing: z.string(),
      areYouTakingBirthControlPills: z.string(),
    })
    .optional()
    .nullable(),
});

export const penaltySchema = z.object({
  penaltyFee: z.number(),
  gcashQrCodeUrl: z.string(),
});

export const updatePenaltyFeeSchema = penaltySchema.pick({ penaltyFee: true });

export const createPaymentVerificationSchema = z.object({
  userId: z.string(),
  gcashReceiptUrl: z.string(),
  appointmentIds: z.string().array(),
  createdBy: z.string(),
});

export const paymentVerificationSchema = createPaymentVerificationSchema.extend(
  {
    id: z.string(),
    status: z.string(),
    createdAt: z.string(),
  }
);
