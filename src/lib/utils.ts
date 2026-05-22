import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BloodType } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiUrl = import.meta.env.VITE_API_URL;

export const ROLES = ["COORDINATOR", "HOSPITAL_ADMIN"];

export const SALUTATIONS = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];

export const HOSPITAL_TYPES = [
  { value: "CLINIC", label: "Clinic" },
  { value: "HEALTH_CENTER", label: "Health Center" },
  { value: "DISTRICT_HOSPITAL", label: "District Hospital" },
  { value: "REFERRAL_HOSPITAL", label: "Referral Hospital" },
  { value: "SPECIALIZED_CENTER", label: "Specialized Center" },
] as const;

export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication required. Please log in first.")
  }

  return token;
};

export const formatDate = (date: string | null) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatEnum = (text: string) =>
  text
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

export const formatBloodType = (bt: BloodType) =>
  bt.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
