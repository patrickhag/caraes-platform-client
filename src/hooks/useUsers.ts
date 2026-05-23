import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type { User } from "../types";
import type { UserFormData } from "../types/schemas";
import { apiUrl, getAuthToken } from "#lib/utils";

interface CreateUserResponse extends User {
  accountEmailSent?: boolean;
}

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = getAuthToken();

      const response = await axios.get<User[]>(`${apiUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
};

export const useGetUser = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ["users", id],
    enabled: !!id,
    queryFn: async () => {
      const token = getAuthToken();

      const response = await axios.get<User>(`${apiUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
  });
};

export const useUpdateUser = (id: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Partial<{
        firstName: string;
        lastName: string;
        prefix: string;
        role: string;
        hospitalId: string;
        isActive: boolean;
      }>,
    ) => {
      const token = getAuthToken();

      const response = await axios.patch<User>(
        `${apiUrl}/api/users/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },

    onError: (error: Error | AxiosError<{ message: string }>) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update user"
        : error.message;

      toast.error(message);
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UserFormData) => {
      const token = getAuthToken();
      const { confirmPassword: _, ...payload } = userData;

      const response = await axios.post<CreateUserResponse>(
        `${apiUrl}/api/users`,
        {
          ...payload,
          hospitalId: payload.hospitalId || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("User created successfully");

      if (data.accountEmailSent === false) {
        toast.warning("Account email could not be sent. Check Resend setup.");
      }
    },

    onError: (error: Error | AxiosError<{ message: string }>) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to create user"
        : error.message;

      toast.error(message);
    },
  });
};
