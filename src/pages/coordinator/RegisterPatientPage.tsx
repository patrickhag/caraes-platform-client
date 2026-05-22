import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreatePatient } from "../../hooks/usePatients";
import { useRwandaLocation } from "../../hooks/useRwandaLocation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#components/ui/form";

import { Button } from "#components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { patientSchema, type PatientFormData } from "../../types/schemas";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Circle,
  HelpCircle,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Input } from "#components/ui/input";
import Loader from "#components/Loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#components/ui/popover";
import { Calendar } from "#components/ui/calendar";
import { cn } from "#lib/utils";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RegisterPatientPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePatient();
  const [openSection, setOpenSection] = useState<string>("demographics");

  const form = useForm<any>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
      nationalId: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      disabilityType: null,
      conditionNotes: "",
      bloodType: null,
      insuranceProvider: "",
      insuranceNumber: "",
      allergies: "",
      medications: "",
      mobilityStatus: "",
      requiresSpecialist: false,
      profileImage: "",
    },
  });

  const onSubmit = (data: PatientFormData) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        navigate("/coordinator/manage-patients");
      },
    });
  };

  // Map each form field to the section it lives in
  const fieldSectionMap: Record<string, string> = {
    firstName: "demographics",
    lastName: "demographics",
    gender: "demographics",
    dateOfBirth: "demographics",
    email: "contact",
    phoneNumber: "contact",
    nationalId: "contact",
    emergencyContactName: "emergency",
    emergencyContactPhone: "emergency",
    province: "location",
    district: "location",
    sector: "location",
    cell: "location",
    village: "location",
    bloodType: "clinical",
    disabilityType: "clinical",
    requiresSpecialist: "clinical",
    profileImage: "clinical",
    allergies: "conditions",
    medications: "conditions",
    mobilityStatus: "conditions",
    conditionNotes: "conditions",
    insuranceProvider: "insurance",
    insuranceNumber: "insurance",
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    const sectionOrder = [
      "demographics",
      "contact",
      "emergency",
      "location",
      "clinical",
      "conditions",
      "insurance",
    ];
    const errorFields = Object.keys(errors);
    for (const section of sectionOrder) {
      if (errorFields.some((f) => fieldSectionMap[f] === section)) {
        setOpenSection(section);
        break;
      }
    }
  };

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

  // Watch fields to dynamically calculate section status
  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const gender = form.watch("gender");
  const email = form.watch("email");
  const phoneNumber = form.watch("phoneNumber");
  const province = form.watch("province");
  const district = form.watch("district");
  const sector = form.watch("sector");
  const cell = form.watch("cell");
  const village = form.watch("village");
  const bloodType = form.watch("bloodType");
  const disabilityType = form.watch("disabilityType");

  const isDemographicsReady = !!firstName && !!lastName && !!gender;
  const isContactReady = !!phoneNumber && !!email && email.includes("@");
  const isLocationReady =
    !!province && !!district && !!sector && !!cell && !!village;
  const isMedicalReady = !!bloodType || !!disabilityType;
  const isInsuranceReady = true; // Fully optional billing section
  const isEmergencyReady = true; // Fully optional emergency contact section

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const handleNextSection = (
    _current: string,
    next: string,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSection(next);
  };

  return (
    <div className="mx-auto max-w-3xl py-6 px-4">
      {/* Back button */}
      <Button
        variant="link"
        onClick={() => navigate("/coordinator/dashboard")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Patients list
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          Register a New Patient
        </h1>
        <p className="mt-2 text-slate-600 text-base">
          Fill in the structured clinical profile to register a new electronic
          health record.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8"
        >
          {/* GROUP 1: PATIENT PROFILE SETUP */}
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <span>Set-up patient profile</span>
              <HelpCircle className="size-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Demographics Section */}
              <div className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  onClick={() => toggleSection("demographics")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "demographics" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {isDemographicsReady ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : openSection === "demographics" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Circle className="size-5 text-slate-300" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Demographics
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isDemographicsReady && (
                      <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Ready
                      </span>
                    )}
                    {openSection === "demographics" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "demographics" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Enter the patient's full legal name, gender designation,
                      and date of birth.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              First Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Jean"
                                {...field}
                                className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                              />
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
                            <FormLabel className="text-slate-700 font-medium">
                              Last Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Mugisha"
                                {...field}
                                className="rounded-lg border-slate-200 focus:border-indigo-500"
                              />
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
                            <FormLabel className="text-slate-700 font-medium">
                              Gender *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
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
                            <FormLabel className="text-slate-700 font-medium">
                              Date of Birth
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full rounded-lg border-slate-200 pl-3 text-left font-normal h-10 hover:bg-slate-50",
                                      !field.value && "text-slate-500",
                                    )}
                                  >
                                    {field.value ? (
                                      formatDate(field.value)
                                    ) : (
                                      <span className="text-slate-400">
                                        Pick a date
                                      </span>
                                    )}
                                    <CalendarIcon className="ml-auto size-4 text-slate-400 opacity-80" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown"
                                  startMonth={new Date(1900, 0)}
                                  endMonth={new Date()}
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      const year = date.getFullYear();
                                      const month = String(
                                        date.getMonth() + 1,
                                      ).padStart(2, "0");
                                      const day = String(
                                        date.getDate(),
                                      ).padStart(2, "0");
                                      field.onChange(`${year}-${month}-${day}`);
                                    } else {
                                      field.onChange("");
                                    }
                                  }}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button
                        type="button"
                        onClick={(e) =>
                          handleNextSection("demographics", "contact", e)
                        }
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium"
                      >
                        Continue to Contact
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact & Identity Section */}
              <div className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  onClick={() => toggleSection("contact")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "contact" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {isContactReady ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : openSection === "contact" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Circle className="size-5 text-slate-300" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Contact & Identity
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isContactReady && (
                      <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Ready
                      </span>
                    )}
                    {openSection === "contact" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "contact" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Register the patient's primary contact details and
                      National Identity Number.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="e.g. patient@domain.com"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
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
                            <FormLabel className="text-slate-700 font-medium">
                              Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. 0788000000"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
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
                            <FormLabel className="text-slate-700 font-medium">
                              National Identity Card / Passport
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="16-digit national registration number"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button
                        type="button"
                        onClick={(e) =>
                          handleNextSection("contact", "emergency", e)
                        }
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium"
                      >
                        Continue to Emergency Contact
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact Section */}
              <div className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  onClick={() => toggleSection("emergency")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "emergency" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {isEmergencyReady &&
                    (form.watch("emergencyContactName") ||
                      form.watch("emergencyContactPhone")) ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : openSection === "emergency" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Circle className="size-5 text-slate-300" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Emergency Contact
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {openSection === "emergency" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "emergency" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Enter details of the designated primary emergency contact
                      relative.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Emergency Contact Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Full Name"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
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
                            <FormLabel className="text-slate-700 font-medium">
                              Emergency Contact Phone *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Phone number"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button
                        type="button"
                        onClick={(e) =>
                          handleNextSection("emergency", "location", e)
                        }
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium"
                      >
                        Continue to Location
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 2: RESIDENTIAL SETTINGS */}
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <span>Residential settings</span>
              <HelpCircle className="size-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Location Details Section */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("location")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "location" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {isLocationReady ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : openSection === "location" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Circle className="size-5 text-slate-300" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Location Details
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isLocationReady && (
                      <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Ready
                      </span>
                    )}
                    {openSection === "location" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "location" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Please enter the patient's local administrative
                      residential details.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Province */}
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Province *
                            </FormLabel>
                            <Select
                              onValueChange={onProvinceChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
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

                      {/* District */}
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              District *
                            </FormLabel>
                            <Select
                              onValueChange={onDistrictChange}
                              value={field.value || ""}
                              disabled={districts.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
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

                      {/* Sector */}
                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Sector *
                            </FormLabel>
                            <Select
                              onValueChange={onSectorChange}
                              value={field.value || ""}
                              disabled={sectors.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
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

                      {/* Cell */}
                      <FormField
                        control={form.control}
                        name="cell"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Cell *
                            </FormLabel>
                            <Select
                              onValueChange={onCellChange}
                              value={field.value || ""}
                              disabled={cells.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
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

                      {/* Village */}
                      <FormField
                        control={form.control}
                        name="village"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">
                              Village *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              disabled={villages.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
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
                    <div className="mt-5 flex justify-end">
                      <Button
                        type="button"
                        onClick={(e) =>
                          handleNextSection("location", "clinical", e)
                        }
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium"
                      >
                        Continue to Medical Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 3: CLINICAL & MEDICAL SETUP */}
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <span>Medical setup</span>
              <HelpCircle className="size-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Clinical Details Section */}
              <div className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  onClick={() => toggleSection("clinical")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "clinical" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {isMedicalReady ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : openSection === "clinical" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Circle className="size-5 text-slate-300" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Clinical Details
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {openSection === "clinical" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "clinical" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Select optional specialized medical details, blood types,
                      and disability statuses.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Blood Type
                            </FormLabel>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(val === "null" ? null : val)
                              }
                              value={field.value || "null"}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
                                  <SelectValue placeholder="Select Blood Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="null">Unknown</SelectItem>
                                <SelectItem value="A_POSITIVE">A+</SelectItem>
                                <SelectItem value="A_NEGATIVE">A-</SelectItem>
                                <SelectItem value="B_POSITIVE">B+</SelectItem>
                                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                                <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                                <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                                <SelectItem value="O_POSITIVE">O+</SelectItem>
                                <SelectItem value="O_NEGATIVE">O-</SelectItem>
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
                            <FormLabel className="text-slate-700 font-medium">
                              Disability Designation
                            </FormLabel>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(val === "null" ? null : val)
                              }
                              value={field.value || "null"}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg border-slate-200">
                                  <SelectValue placeholder="Select Disability Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                <SelectItem value="DOWN_SYNDROME">
                                  Down Syndrome
                                </SelectItem>
                                <SelectItem value="AUTISM">Autism</SelectItem>
                                <SelectItem value="VISUAL_IMPAIRMENT">
                                  Visual Impairment
                                </SelectItem>
                                <SelectItem value="HEARING_IMPAIRMENT">
                                  Hearing Impairment
                                </SelectItem>
                                <SelectItem value="MOBILITY_DISABILITY">
                                  Mobility Disability
                                </SelectItem>
                                <SelectItem value="CEREBRAL_PALSY">
                                  Cerebral Palsy
                                </SelectItem>
                                <SelectItem value="EPILEPSY">
                                  Epilepsy
                                </SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Profile Image URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://image-host.com/avatar.jpg"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="requiresSpecialist"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-slate-200 p-4 bg-slate-50/50 mt-6">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="size-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </FormControl>
                            <div className="space-y-1.5 leading-none">
                              <FormLabel className="text-sm font-semibold text-slate-800 cursor-pointer">
                                Requires Specialist
                              </FormLabel>
                              <p className="text-xs text-slate-500">
                                Toggle if patient needs urgent specialized
                                review or critical follow-ups.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button
                        type="button"
                        onClick={(e) =>
                          handleNextSection("clinical", "conditions", e)
                        }
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium"
                      >
                        Continue to Medical Conditions
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Conditions & Medications Section */}
              <div className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  onClick={() => toggleSection("conditions")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "conditions" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {openSection === "conditions" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Conditions & Medications
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {openSection === "conditions" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "conditions" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Enter general notes, drug or food allergies, active
                      medications, and mobility notes.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Allergies
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Penicillin, Peanuts"
                                {...field}
                                className="rounded-lg border-slate-200"
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
                            <FormLabel className="text-slate-700 font-medium">
                              Current Medications
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Metformin 500mg, Albuterol"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobilityStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Mobility Status
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Walks independently / Wheelchair dependent"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="conditionNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              General Condition Notes
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add any outstanding medical summaries..."
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button
                        type="button"
                        onClick={(e) =>
                          handleNextSection("conditions", "insurance", e)
                        }
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium"
                      >
                        Continue to Insurance
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 4: ADMINISTRATIVE & INSURANCE */}
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <span>Administrative & Billing</span>
              <HelpCircle className="size-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Insurance Details Section */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("insurance")}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-slate-50/50 ${
                    openSection === "insurance" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {isInsuranceReady &&
                    (form.watch("insuranceProvider") ||
                      form.watch("insuranceNumber")) ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : openSection === "insurance" ? (
                      <CircleDashed className="size-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Circle className="size-5 text-slate-300" />
                    )}
                    <span className="font-semibold text-slate-900 text-[15px]">
                      Insurance Details
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {openSection === "insurance" ? (
                      <ChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {openSection === "insurance" && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <p className="mb-4 text-sm text-slate-500 leading-relaxed">
                      Enter the patient's primary health insurance provider and
                      card policy number.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="insuranceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Insurance Provider
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. RSSB / RAMA / MMI"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
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
                            <FormLabel className="text-slate-700 font-medium">
                              Policy / Card Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Card registration ID"
                                {...field}
                                className="rounded-lg border-slate-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 5: PREMIUM SUBMIT ACTION (Visual premium banner matching mock image's bottom section) */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Submit Patient Record
                </h3>
                <span className="inline-flex rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                  Clinical
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                Confirm all patient details and residential settings are fully
                validated before committing the Electronic Health Record to our
                secure clinical directory.
              </p>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-4 shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader text="Registering..." />
                ) : (
                  <>Register Patient</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
