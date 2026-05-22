import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../types";
import { ArrowUpDown } from "lucide-react";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const userColumns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorFn: (user) =>
      [user.prefix, user.firstName, user.lastName].filter(Boolean).join(" "),
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="inline-flex items-center gap-2 font-semibold text-slate-700"
      >
        Name
        <ArrowUpDown className="size-4 text-slate-400" />
      </button>
    ),
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div>
          <p className="font-medium text-slate-950">
            {[user.prefix, user.firstName, user.lastName]
              .filter(Boolean)
              .join(" ")}
          </p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => (
      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
        {String(getValue()).replaceAll("_", " ")}
      </span>
    ),
  },
  {
    id: "hospital",
    accessorFn: (user) => user.hospital?.name ?? "",
    header: "Hospital",
    cell: ({ row }) => {
      const hospitalName = row.original.hospital?.name;

      return (
        <span className="text-slate-600">
          {hospitalName ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ getValue }) => {
      const isVerified = Boolean(getValue());

      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            isVerified
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isVerified ? "Verified" : "Pending"}
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
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ getValue }) => (
      <span className="text-slate-600">{formatDate(String(getValue()))}</span>
    ),
  },
];
