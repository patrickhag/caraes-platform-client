import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { Button } from "#components/ui/button";
import { Label } from "#components/ui/label";
import { Input } from "#components/ui/input";
import Loader from "#components/Loader";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, isPending } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");

    try {
      await forgotPassword(data);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <main className="min-h-screen flex border-2 border-blue-800 overflow-hidden bg-white">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-20 bg-gray-50">
        <section className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 flex flex-col items-start gap-3">
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="w-5 h-5 bg-blue-700 rounded-lg" />
                <div className="w-5 h-5 bg-blue-700 rounded-lg" />
                <div className="w-5 h-5 bg-blue-700 rounded-lg" />
                <div className="w-5 h-5 bg-blue-700 rounded-lg" />
              </div>

              <span className="text-2xl font-bold tracking-wide">NCTAIS</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Ndera Caraes Transfer and Appointment Information System
            </p>
          </div>

          {!isSuccess ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
              <p className="text-gray-500 mb-8">
                Enter your email address and your new password. We'll send you a
                link to confirm the reset.
              </p>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    {...form.register("email")}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email?.message}
                  </p>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password?.message}
                  </p>
                </div>

                {serverError && (
                  <p className="text-red-600 text-sm text-center">
                    {serverError}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-800"
                >
                  {isPending ? (
                    <Loader text="Sending Reset Link..." />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <a
                    href="/"
                    className="text-sm text-blue-700 hover:underline font-medium"
                  >
                    Back to login
                  </a>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold mb-2">Check your email</h1>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                We have sent a password reset link to{" "}
                <strong className="text-gray-900">
                  {form.getValues("email")}
                </strong>
                .
              </p>

              <Button
                onClick={() => navigate("/")}
                className="w-full bg-blue-800"
              >
                Back to login
              </Button>
            </div>
          )}
        </section>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="hidden md:block w-1/2"
        style={{
          backgroundImage: "url('/ndera-hospital.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </main>
  );
}
