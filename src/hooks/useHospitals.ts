import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type { Hospital } from "../types";
import type { HospitalFormData } from "../types/schemas";
import { apiUrl, getAuthToken } from "#lib/utils";

export const useGetHospitals = (options?: { activeOnly?: boolean; enabled?: boolean }) => {
  const activeOnly = options?.activeOnly ?? false;

  return useQuery({
    queryKey: activeOnly ? ["hospitals", "active"] : ["hospitals"],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const token = getAuthToken();

      const response = await axios.get<Hospital[]>(`${apiUrl}/api/hospitals`, {
        params: activeOnly ? { active: "true" } : undefined,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
};

export const useCreateHospital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HospitalFormData) => {
      const token = getAuthToken();

      const response = await axios.post<Hospital>(
        `${apiUrl}/api/hospitals`,
        {
          name: data.name,
          type: data.type,
          province: data.province,
          district: data.district,
          phone: data.phone?.trim() || undefined,
          email: data.email?.trim() || undefined,
          sector: data.sector?.trim() || undefined,
          cell: data.cell?.trim() || undefined,
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
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
      toast.success("Hospital created successfully");
    },

    onError: (error: Error | AxiosError<{ message: string }>) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to create hospital"
        : error.message;

      toast.error(message);
    },
  });
};
