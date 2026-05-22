import type { ColumnDef } from "@tanstack/react-table";
import type { Patient, DisabilityType } from "../../types";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "#components/ui/button";
import { useNavigate } from "react-router-dom";

const formatDate = (date: string | null) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const formatEnumText = (text: string) => {
  return text
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export const patientColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    accessorFn: (p) => `${p.firstName} ${p.lastName}`,
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="inline-flex items-center gap-2 font-semibold text-slate-700"
      >
        Patient
        <ArrowUpDown className="size-4 text-slate-400" />
      </button>
    ),
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <div>
          <p className="font-semibold text-slate-950">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-sm text-slate-500">
            {patient.gender} · DOB: {formatDate(patient.dateOfBirth)}
          </p>
        </div>
      );
    },
  },
  {
    id: "contact",
    header: "Contact Details",
    cell: ({ row }) => {
      const { email, phoneNumber } = row.original;
      return (
        <div className="text-sm text-slate-600">
          <p className="font-medium text-slate-800">{phoneNumber}</p>
          <p className="text-slate-500">{email}</p>
        </div>
      );
    },
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const { province, district, sector, cell, village } = row.original;
      return (
        <div className="text-sm text-slate-600">
          <p className="font-medium text-slate-800">
            {province} · {district}
          </p>
          <p className="text-slate-500">
            {sector} · {cell} · {village}
          </p>
        </div>
      );
    },
  },
  {
    id: "medical",
    header: "Medical Details",
    cell: ({ row }) => {
      const {
        disabilityType,
        bloodType,
        requiresSpecialist,
        insuranceProvider,
      } = row.original;

      return (
        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
          {bloodType && (
            <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-100">
              {bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
            </span>
          )}
          {disabilityType && (
            <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100">
              {formatEnumText(disabilityType as DisabilityType)}
            </span>
          )}
          {requiresSpecialist && (
            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
              Specialist req.
            </span>
          )}
          {insuranceProvider && (
            <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
              {insuranceProvider}
            </span>
          )}
          {!bloodType &&
            !disabilityType &&
            !requiresSpecialist &&
            !insuranceProvider && (
              <span className="text-slate-400 text-sm">—</span>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-600">
        {formatDate(String(getValue()))}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const navigate = useNavigate();
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/coordinator/patients/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
          View Patient
        </Button>
      );
    },
  },
];
