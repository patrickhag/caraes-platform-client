import type { ColumnDef } from "@tanstack/react-table";
import type { Hospital, HospitalType } from "../../types";
import { ArrowUpDown } from "lucide-react";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const formatHospitalType = (type: HospitalType) => {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export const hospitalColumns: ColumnDef<Hospital>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="inline-flex items-center gap-2 font-semibold text-slate-700"
      >
        Hospital
        <ArrowUpDown className="size-4 text-slate-400" />
      </button>
    ),
    cell: ({ row }) => {
      const hospital = row.original;

      return (
        <div>
          <p className="font-medium text-slate-950">{hospital.name}</p>
          <p className="text-sm text-slate-500">
            {[hospital.province, hospital.district, hospital.sector]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => (
      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
        {formatHospitalType(getValue() as HospitalType)}
      </span>
    ),
  },
  {
    id: "contact",
    accessorFn: (h) => [h.email, h.phone].filter(Boolean).join(" · ") || "—",
    header: "Contact",
    cell: ({ row }) => {
      const { email, phone } = row.original;

      if (!email && !phone) {
        return <span className="text-slate-500">—</span>;
      }

      return (
        <div className="text-sm text-slate-600">
          {email && <p>{email}</p>}
          {phone && <p>{phone}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ getValue }) => {
      const active = Boolean(getValue());

      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            active
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="inline-flex items-center gap-2 font-semibold text-slate-700"
      >
        Created
        <ArrowUpDown className="size-4 text-slate-400" />
      </button>
    ),
    cell: ({ getValue }) => (
      <span className="text-slate-600">{formatDate(String(getValue()))}</span>
    ),
  },
];
