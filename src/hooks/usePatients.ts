import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type { Patient } from "../types";
import type { PatientFormData } from "../types/schemas";
import { apiUrl, getAuthToken } from "#lib/utils";

export const useGetPatient = (id: string | undefined) => {
  return useQuery({
    queryKey: ["patients", id],
    enabled: !!id,
    queryFn: async () => {
      const token = getAuthToken();

      const response = await axios.get<Patient>(
        `${apiUrl}/api/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
  });
};

export const useGetPatients = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["patients"],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const token = getAuthToken();

      const response = await axios.get<Patient[]>(`${apiUrl}/api/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
};

export const useUpdatePatient = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PatientFormData>) => {
      const token = getAuthToken();

      const response = await axios.patch<Patient>(
        `${apiUrl}/api/patients/${id}`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth || null,
          nationalId: data.nationalId || null,
          phoneNumber: data.phoneNumber,
          email: data.email,
          emergencyContactName: data.emergencyContactName || null,
          emergencyContactPhone: data.emergencyContactPhone || null,
          province: data.province,
          district: data.district,
          sector: data.sector,
          cell: data.cell,
          village: data.village,
          disabilityType: data.disabilityType || null,
          conditionNotes: data.conditionNotes || null,
          bloodType: data.bloodType || null,
          insuranceProvider: data.insuranceProvider || null,
          insuranceNumber: data.insuranceNumber || null,
          allergies: data.allergies || null,
          medications: data.medications || null,
          mobilityStatus: data.mobilityStatus || null,
          requiresSpecialist: data.requiresSpecialist ?? false,
          profileImage: data.profileImage || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    },

    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", updated.id] });
      toast.success("Patient updated successfully");
    },

    onError: (error: Error | AxiosError<{ message: string }>) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update patient"
        : error.message;

      toast.error(message);
    },
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatientFormData) => {
      const token = getAuthToken();

      const response = await axios.post<Patient>(
        `${apiUrl}/api/patients`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth || undefined,
          nationalId: data.nationalId || undefined,
          phoneNumber: data.phoneNumber,
          email: data.email,
          emergencyContactName: data.emergencyContactName || undefined,
          emergencyContactPhone: data.emergencyContactPhone || undefined,
          province: data.province,
          district: data.district,
          sector: data.sector,
          cell: data.cell,
          village: data.village,
          disabilityType: data.disabilityType || undefined,
          conditionNotes: data.conditionNotes || undefined,
          bloodType: data.bloodType || undefined,
          insuranceProvider: data.insuranceProvider || undefined,
          insuranceNumber: data.insuranceNumber || undefined,
          allergies: data.allergies || undefined,
          medications: data.medications || undefined,
          mobilityStatus: data.mobilityStatus || undefined,
          requiresSpecialist: data.requiresSpecialist ?? false,
          profileImage: data.profileImage || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient registered successfully");
    },

    onError: (error: Error | AxiosError<{ message: string }>) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to register patient"
        : error.message;

      toast.error(message);
    },
  });
};
