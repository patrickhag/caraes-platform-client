import { useState } from "react";
import axios from "axios";
import { apiUrl } from "#lib/utils";

interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

interface LoginResult {
  token: string;
  redirectTo: string;
  userRole: string;
  hospitalId?: string | null;
  hospitalName?: string | null;
}

interface ForgotPasswordData {
  email: string;
  password: string;
}

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  forgotPassword: (data: ForgotPasswordData) => Promise<{ message: string }>;
  isPending: boolean;
  error: Error | null;
}

export function useAuth(): UseAuthReturn {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsPending(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        credentials,
      );

      const { token, redirectTo, userRole, hospitalId, hospitalName } =
        response.data;

      if (!token || !redirectTo) {
        throw new Error("Invalid response from server");
      }

      return { token, redirectTo, userRole, hospitalId, hospitalName };
    } catch (err) {
      const errorMessage = axios.isAxiosError<{ message: string }>(err)
        ? err.response?.data?.message || "An error occurred during login"
        : err instanceof Error
          ? err.message
          : "An error occurred during login";
      const loginError = new Error(errorMessage, { cause: err });

      setError(loginError);
      throw loginError;
    } finally {
      setIsPending(false);
    }
  };

  const forgotPassword = async (
    data: ForgotPasswordData,
  ): Promise<{ message: string }> => {
    setIsPending(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/forgot-password`,
        data,
      );

      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError<{ message: string }>(err)
        ? err.response?.data?.message ||
          "An error occurred while requesting password reset"
        : err instanceof Error
          ? err.message
          : "An error occurred while requesting password reset";
      const resetError = new Error(errorMessage, { cause: err });

      setError(resetError);
      throw resetError;
    } finally {
      setIsPending(false);
    }
  };

  return { login, forgotPassword, isPending, error };
}
