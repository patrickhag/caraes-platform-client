import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useUpdateHospital } from "../../hooks/useHospitals";
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
import { hospitalSchema, type HospitalFormData } from "../../types/schemas";
import { HOSPITAL_TYPES } from "#lib/utils";
import Loader from "../Loader";
import type { Hospital } from "../../types";

interface EditHospitalSheetProps {
  hospital: Hospital;
}

export default function EditHospitalSheet({
  hospital,
}: EditHospitalSheetProps) {
  const { mutate, isPending } = useUpdateHospital(hospital.id);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(hospital.isActive);

  const form = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: hospital.name,
      type: hospital.type,
      phone: hospital.phone ?? "",
      email: hospital.email ?? "",
      province: hospital.province,
      district: hospital.district,
      sector: hospital.sector ?? "",
      cell: hospital.cell ?? "",
    },
  });

  // Re-sync form when hospital prop changes (e.g. after a refetch)
  useEffect(() => {
    form.reset({
      name: hospital.name,
      type: hospital.type,
      phone: hospital.phone ?? "",
      email: hospital.email ?? "",
      province: hospital.province,
      district: hospital.district,
      sector: hospital.sector ?? "",
      cell: hospital.cell ?? "",
    });
    setIsActive(hospital.isActive);
  }, [hospital, form]);

  const {
    provinces,
    districts,
    sectors,
    cells,
    onProvinceChange,
    onDistrictChange,
    onSectorChange,
    onCellChange,
  } = useRwandaLocation(form);

  const onSubmit = (data: HospitalFormData) => {
    mutate(
      { ...data, isActive },
      {
        onSuccess: () => setIsOpen(false),
      },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Pencil className="size-4" />
          Edit Hospital
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:w-[92vw] data-[side=right]:sm:max-w-[760px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Hospital</SheetTitle>
          <SheetDescription>
            Update the details for{" "}
            <span className="font-medium">{hospital.name}</span>.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="m-6 space-y-6"
          >
            {/* Hospital Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kigali University Teaching Hospital"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Facility Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hospital type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {HOSPITAL_TYPES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone & Email */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+250 788 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
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
                        placeholder="info@hospital.rw"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Province & District */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
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
                    <FormLabel>District</FormLabel>
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
            </div>

            {/* Sector & Cell */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
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
                    <FormLabel>Cell</FormLabel>
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
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">
                Status
              </label>
              <Select
                value={isActive ? "active" : "inactive"}
                onValueChange={(v) => setIsActive(v === "active")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Inactive hospitals won't appear in patient registration
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsActive(hospital.isActive);
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
