export interface UserData {
  firstName: string;
  lastName: string;
  prefix: string;
  email: string;
  password: string;
  role: string;
}

export interface ResponseData {
  message: string;
}

export type HospitalType =
  | "CLINIC"
  | "HEALTH_CENTER"
  | "DISTRICT_HOSPITAL"
  | "REFERRAL_HOSPITAL"
  | "SPECIALIZED_CENTER";

export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  phone: string | null;
  email: string | null;
  province: string;
  district: string;
  sector: string | null;
  cell: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: HospitalUser[];
}

export interface HospitalUser {
  id: string;
  firstName: string;
  lastName: string;
  prefix: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UserHospital {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  prefix: string | null;
  email: string;
  role: string;
  hospitalId: string | null;
  hospital: UserHospital | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodType =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type DisabilityType =
  | "DOWN_SYNDROME"
  | "AUTISM"
  | "VISUAL_IMPAIRMENT"
  | "HEARING_IMPAIRMENT"
  | "MOBILITY_DISABILITY"
  | "CEREBRAL_PALSY"
  | "EPILEPSY"
  | "OTHER";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string | null;
  nationalId: string | null;
  phoneNumber: string;
  email: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  disabilityType: DisabilityType | null;
  conditionNotes: string | null;
  bloodType: BloodType | null;
  insuranceProvider: string | null;
  insuranceNumber: string | null;
  allergies: string | null;
  medications: string | null;
  mobilityStatus: string | null;
  requiresSpecialist: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}
