import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { z } from "zod";
import { useUpdateUser } from "../../hooks/useUsers";
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
import { ROLES, SALUTATIONS } from "#lib/utils";
import Loader from "../Loader";
import type { User } from "../../types";
import { useMemo } from "react";

const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  prefix: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  hospitalId: z.string().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

const ROLES_WITH_HOSPITAL = ["COORDINATOR", "HOSPITAL_ADMIN"];

interface EditUserSheetProps {
  user: User;
}

export default function EditUserSheet({ user }: EditUserSheetProps) {
  const { mutate, isPending } = useUpdateUser(user.id);
  const { data: hospitals = [], isLoading: hospitalsLoading } =
    useGetHospitals();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(user.isActive);

  const activeHospitals = useMemo(
    () => hospitals.filter((h) => h.isActive),
    [hospitals],
  );

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      prefix: user.prefix ?? "",
      role: user.role,
      hospitalId: user.hospitalId ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      prefix: user.prefix ?? "",
      role: user.role,
      hospitalId: user.hospitalId ?? "",
    });
    setIsActive(user.isActive);
  }, [user, form]);

  const selectedRole = form.watch("role");
  const showHospitalField = ROLES_WITH_HOSPITAL.includes(selectedRole);

  const onSubmit = (data: EditUserFormData) => {
    mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        prefix: data.prefix || undefined,
        role: data.role,
        hospitalId: showHospitalField
          ? data.hospitalId || undefined
          : undefined,
        isActive,
      },
      { onSuccess: () => setIsOpen(false) },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Pencil className="size-4" />
          Edit User
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:w-[92vw] data-[side=right]:sm:max-w-[760px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update details for{" "}
            <span className="font-medium">
              {user.firstName} {user.lastName}
            </span>
            .
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="m-6 space-y-6"
          >
            {/* Name row */}
            <div className="grid gap-6 sm:grid-cols-2">
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
            </div>

            {/* Prefix */}
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select prefix" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
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

            {/* Hospital (conditional) */}
            {showHospitalField && (
              <FormField
                control={form.control}
                name="hospitalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
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

            {/* Account Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">
                Account Status
              </label>
              <Select
                value={isActive ? "active" : "disabled"}
                onValueChange={(v) => setIsActive(v === "active")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Disabled accounts cannot log in to the system
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsActive(user.isActive);
                }}
              >
                Reset
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader text="Saving..." /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
