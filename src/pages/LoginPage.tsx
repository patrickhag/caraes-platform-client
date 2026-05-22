import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "#components/ui/button";
import { Label } from "#components/ui/label";
import { Input } from "#components/ui/input";
import { RadioGroup, RadioGroupItem } from "#components/ui/radio-group";
import Loader from "#components/Loader";
import { roles } from "../config/roles";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.string().min(1, "Role is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isPending } = useAuth();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      role: "ADMIN",
    },
  });

  const watchedRole = form.watch("role");

  const selectedRoleLabel = useMemo(
    () => roles.find((item) => item.value === watchedRole)?.label,
    [roles, watchedRole],
  );

  const onSubmit = async (data: FormData) => {
    setServerError("");

    try {
      const result = await login(data);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userRole", data.role);
      if (result.hospitalId) {
        localStorage.setItem("hospitalId", result.hospitalId);
        localStorage.setItem("hospitalName", result.hospitalName ?? "");
      } else {
        localStorage.removeItem("hospitalId");
        localStorage.removeItem("hospitalName");
      }
      navigate(result.redirectTo);
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
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

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Please enter your details</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                {...form.register("email")}
                placeholder="johndoe@gmail.com"
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.email?.message}
              </p>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="pr-10"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password?.message}
              </p>
            </div>

            {/* Role */}
            <div>
              <Label>Select Role</Label>

              <RadioGroup
                value={watchedRole}
                onValueChange={(value) =>
                  form.setValue("role", value, {
                    shouldValidate: true,
                  })
                }
                className="flex gap-4 mt-2"
              >
                {roles.map((item) => (
                  <div key={item.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={item.value}
                      id={`role-${item.value}`}
                    />
                    <Label htmlFor={`role-${item.value}`}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>

              <p className="text-sm text-red-500">
                {form.formState.errors.role?.message}
              </p>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-blue-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-red-600 text-sm text-center">{serverError}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-800"
            >
              {isPending ? (
                <Loader text={`Logging in as ${selectedRoleLabel}...`} />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </section>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="hidden md:block w-1/2 bg-blue-700"
        style={{
          backgroundImage: "url('/ndera-hospital.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </main>
  );
}
