import z from "zod";

const rolesRequiringHospital = ["COORDINATOR", "HOSPITAL_ADMIN"] as const;

export const loginSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    prefix: z.string().optional(),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.string().min(1, "Role is required"),
    hospitalId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      !rolesRequiringHospital.includes(
        data.role as (typeof rolesRequiringHospital)[number],
      ) || !!data.hospitalId,
    {
      message: "Hospital is required for this role",
      path: ["hospitalId"],
    },
  );

export type UserFormData = z.infer<typeof loginSchema>;

const hospitalTypeValues = [
  "CLINIC",
  "HEALTH_CENTER",
  "DISTRICT_HOSPITAL",
  "REFERRAL_HOSPITAL",
  "SPECIALIZED_CENTER",
] as const;

export const hospitalSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  type: z.enum(hospitalTypeValues, {
    message: "Hospital type is required",
  }),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  sector: z.string().optional(),
  cell: z.string().optional(),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;

export const genderValues = ["MALE", "FEMALE", "OTHER"] as const;
export const bloodTypeValues = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;
export const disabilityTypeValues = [
  "DOWN_SYNDROME",
  "AUTISM",
  "VISUAL_IMPAIRMENT",
  "HEARING_IMPAIRMENT",
  "MOBILITY_DISABILITY",
  "CEREBRAL_PALSY",
  "EPILEPSY",
  "OTHER",
] as const;

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Please select a gender type."),
  dateOfBirth: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  nationalId: z.string().optional().or(z.literal("")),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(1, "Emergency contact phone is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  sector: z.string().min(1, "Sector is required"),
  cell: z.string().min(1, "Cell is required"),
  village: z.string().min(1, "Village is required"),
  disabilityType: z
    .enum(disabilityTypeValues)
    .nullable()
    .optional()
    .or(z.literal("")),
  conditionNotes: z.string().optional(),
  bloodType: z.enum(bloodTypeValues).nullable().optional().or(z.literal("")),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  mobilityStatus: z.string().optional(),
  requiresSpecialist: z.boolean().default(false),
  profileImage: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
