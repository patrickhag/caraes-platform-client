import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateUser } from "../../hooks/useUsers";
import { useGetHospitals } from "../../hooks/useHospitals";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type UserFormData } from "../../types/schemas";
import { ROLES, SALUTATIONS } from "#lib/utils";
import Loader from "../Loader";

const ROLES_WITH_HOSPITAL = ["COORDINATOR", "HOSPITAL_ADMIN"];

export default function AddUserSheet() {
  const { mutate, isPending } = useCreateUser();
  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitals();
  const [isOpen, setIsOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const activeHospitals = useMemo(
    () => hospitals.filter((h) => h.isActive),
    [hospitals],
  );

  const form = useForm<UserFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      prefix: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      hospitalId: "",
    },
  });

  const selectedRole = form.watch("role");
  const showHospitalField =
    ROLES_WITH_HOSPITAL.includes(selectedRole);

  const onSubmit = (data: UserFormData) => {
    mutate(data, {
      onSuccess: () => {
        form.reset({
          firstName: "",
          lastName: "",
          prefix: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          hospitalId: "",
        });
        setIsOpen(false);
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Add New User</Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:w-[92vw] data-[side=right]:sm:max-w-[760px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New User</SheetTitle>
          <SheetDescription>
            Add a new system user and assign them to a hospital.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 m-6"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="prefix" className="text-sm text-gray-700">
                    Prefix
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                        <SelectValue placeholder="Select your prefix" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {SALUTATIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (!ROLES_WITH_HOSPITAL.includes(value)) {
                        form.setValue("hospitalId", "");
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showHospitalField && (
              <FormField
                control={form.control}
                name="hospitalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={hospitalsLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                hospitalsLoading
                                  ? "Loading hospitals..."
                                  : "Select a hospital"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeHospitals.length === 0 ? (
                            <SelectItem value="__none__" disabled>
                              No active hospitals available
                            </SelectItem>
                          ) : (
                            activeHospitals.map((hospital) => (
                              <SelectItem key={hospital.id} value={hospital.id}>
                                {hospital.name} — {hospital.district}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.reset({
                    firstName: "",
                    lastName: "",
                    prefix: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                    hospitalId: "",
                  })
                }
              >
                Reset
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader text="Creating..." /> : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
