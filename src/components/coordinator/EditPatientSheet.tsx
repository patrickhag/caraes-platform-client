import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, CalendarIcon } from "lucide-react";
import { useUpdatePatient } from "../../hooks/usePatients";
import { useRwandaLocation } from "../../hooks/useRwandaLocation";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "#lib/utils";
import {
  patientSchema,
  type PatientFormData,
  genderValues,
  bloodTypeValues,
  disabilityTypeValues,
} from "../../types/schemas";
import Loader from "../Loader";
import type { Patient } from "../../types";

interface EditPatientSheetProps {
  patient: Patient;
}

const formatDateDisplay = (dateString?: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toDateInputValue = (dateString?: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function EditPatientSheet({ patient }: EditPatientSheetProps) {
  const { mutate, isPending } = useUpdatePatient(patient.id);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      dateOfBirth: toDateInputValue(patient.dateOfBirth),
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      nationalId: patient.nationalId ?? "",
      emergencyContactName: patient.emergencyContactName ?? "",
      emergencyContactPhone: patient.emergencyContactPhone ?? "",
      province: patient.province,
      district: patient.district,
      sector: patient.sector,
      cell: patient.cell,
      village: patient.village,
      disabilityType:
        (patient.disabilityType as PatientFormData["disabilityType"]) ?? null,
      conditionNotes: patient.conditionNotes ?? "",
      bloodType: (patient.bloodType as PatientFormData["bloodType"]) ?? null,
      insuranceProvider: patient.insuranceProvider ?? "",
      insuranceNumber: patient.insuranceNumber ?? "",
      allergies: patient.allergies ?? "",
      medications: patient.medications ?? "",
      mobilityStatus: patient.mobilityStatus ?? "",
      requiresSpecialist: patient.requiresSpecialist,
      profileImage: patient.profileImage ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        gender: patient.gender,
        dateOfBirth: toDateInputValue(patient.dateOfBirth),
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        nationalId: patient.nationalId ?? "",
        emergencyContactName: patient.emergencyContactName ?? "",
        emergencyContactPhone: patient.emergencyContactPhone ?? "",
        province: patient.province,
        district: patient.district,
        sector: patient.sector,
        cell: patient.cell,
        village: patient.village,
        disabilityType:
          (patient.disabilityType as PatientFormData["disabilityType"]) ?? null,
        conditionNotes: patient.conditionNotes ?? "",
        bloodType: (patient.bloodType as PatientFormData["bloodType"]) ?? null,
        insuranceProvider: patient.insuranceProvider ?? "",
        insuranceNumber: patient.insuranceNumber ?? "",
        allergies: patient.allergies ?? "",
        medications: patient.medications ?? "",
        mobilityStatus: patient.mobilityStatus ?? "",
        requiresSpecialist: patient.requiresSpecialist,
        profileImage: patient.profileImage ?? "",
      });
    }
  }, [isOpen, patient, form]);

  const {
    provinces,
    districts,
    sectors,
    cells,
    villages,
    onProvinceChange,
    onDistrictChange,
    onSectorChange,
    onCellChange,
  } = useRwandaLocation(form);

  const onSubmit = (data: PatientFormData) => {
    mutate(data, { onSuccess: () => setIsOpen(false) });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Pencil className="size-4" />
          Edit Patient
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:w-[92vw] data-[side=right]:sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Patient</SheetTitle>
          <SheetDescription>
            Update the health record for{" "}
            <span className="font-medium">
              {patient.firstName} {patient.lastName}
            </span>
            .
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="m-6 space-y-8"
          >
            {/* ── Demographics ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Demographics
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderValues.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g.charAt(0) + g.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal h-10",
                                !field.value && "text-slate-400",
                              )}
                            >
                              {field.value
                                ? formatDateDisplay(field.value)
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            startMonth={new Date(1900, 0)}
                            endMonth={new Date()}
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const y = date.getFullYear();
                                const m = String(date.getMonth() + 1).padStart(
                                  2,
                                  "0",
                                );
                                const d = String(date.getDate()).padStart(
                                  2,
                                  "0",
                                );
                                field.onChange(`${y}-${m}-${d}`);
                              } else {
                                field.onChange("");
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── Contact & Identity ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact &amp; Identity
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>National ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── Emergency Contact ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Emergency Contact
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── Location ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Location
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province *</FormLabel>
                      <Select
                        onValueChange={onProvinceChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map((p) => (
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
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <Select
                        onValueChange={onDistrictChange}
                        value={field.value || ""}
                        disabled={districts.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                districts.length === 0
                                  ? "Select province first"
                                  : "Select district"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector *</FormLabel>
                      <Select
                        onValueChange={onSectorChange}
                        value={field.value || ""}
                        disabled={sectors.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                sectors.length === 0
                                  ? "Select district first"
                                  : "Select sector"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectors.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cell"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cell *</FormLabel>
                      <Select
                        onValueChange={onCellChange}
                        value={field.value || ""}
                        disabled={cells.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                cells.length === 0
                                  ? "Select sector first"
                                  : "Select cell"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cells.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Village *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={villages.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                villages.length === 0
                                  ? "Select cell first"
                                  : "Select village"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {villages.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── Clinical ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clinical Details
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select
                        onValueChange={(v) =>
                          field.onChange(v === "__none__" ? null : v)
                        }
                        value={field.value ?? "__none__"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {bloodTypeValues.map((bt) => (
                            <SelectItem key={bt} value={bt}>
                              {bt
                                .replace("_POSITIVE", "+")
                                .replace("_NEGATIVE", "-")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="disabilityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disability Type</FormLabel>
                      <Select
                        onValueChange={(v) =>
                          field.onChange(v === "__none__" ? null : v)
                        }
                        value={field.value ?? "__none__"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select disability type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {disabilityTypeValues.map((dt) => (
                            <SelectItem key={dt} value={dt}>
                              {dt
                                .split("_")
                                .map(
                                  (w) => w.charAt(0) + w.slice(1).toLowerCase(),
                                )
                                .join(" ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobilityStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobility Status</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Wheelchair user" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requiresSpecialist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requires Specialist</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "yes")}
                        value={field.value ? "yes" : "no"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditionNotes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Condition Notes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Additional clinical notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── Allergies & Medications ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Allergies &amp; Medications
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Penicillin, Peanuts"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Metformin 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── Insurance ── */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Insurance
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. RSSB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
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
