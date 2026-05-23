import { useNavigate, useParams } from "react-router-dom";
import { useGetHospital } from "../../hooks/useHospitals";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Button } from "#components/ui/button";
import Loader from "#components/Loader";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  CalendarDays,
  Users,
} from "lucide-react";
import { formatDate, formatHospitalType, formatRole } from "#lib/utils";
import type { HospitalUser } from "../../types";
import EditHospitalSheet from "../../components/admin/EditHospitalSheet";
import { InfoRow } from "#components/InfoRow";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  HOSPITAL_ADMIN: "bg-blue-50 text-blue-700",
  COORDINATOR: "bg-amber-50 text-amber-700",
};

function AffiliatedUsers({ users }: { users: HospitalUser[] }) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-2">
        No users affiliated with this hospital.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {users.map((user) => {
        const initials =
          `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        const colorClass =
          roleColors[user.role] ?? "bg-slate-100 text-slate-600";

        return (
          <li
            key={user.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.prefix ? `${user.prefix} ` : ""}
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
              >
                {formatRole(user.role)}
              </span>
              {!user.isVerified && (
                <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600">
                  Unverified
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: hospital, isLoading, isError } = useGetHospital(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !hospital) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 px-0"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <p className="text-red-600">Hospital not found or failed to load.</p>
      </div>
    );
  }

  const initials = hospital.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back */}
      <Button
        variant="link"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-0"
      >
        <ArrowLeft className="size-4" />
        Back to Hospitals
      </Button>

      {/* Header */}
      <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-950 truncate">
            {hospital.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {formatHospitalType(hospital.type)} ·{" "}
            {[hospital.province, hospital.district].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              hospital.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {hospital.isActive ? "Active" : "Inactive"}
          </span>
          <EditHospitalSheet hospital={hospital} />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Facility Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-500" />
              Facility Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow label="Name" value={hospital.name} />
            <InfoRow label="Type" value={formatHospitalType(hospital.type)} />
            <InfoRow
              label="Status"
              value={
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    hospital.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {hospital.isActive ? "Active" : "Inactive"}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-4 text-indigo-500" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow
              label="Phone"
              value={
                hospital.phone ? (
                  <a
                    href={`tel:${hospital.phone}`}
                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline"
                  >
                    <Phone className="size-3.5" />
                    {hospital.phone}
                  </a>
                ) : null
              }
            />
            <InfoRow
              label="Email"
              value={
                hospital.email ? (
                  <a
                    href={`mailto:${hospital.email}`}
                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline"
                  >
                    <Mail className="size-3.5" />
                    {hospital.email}
                  </a>
                ) : null
              }
            />
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-emerald-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoRow label="Province" value={hospital.province} />
            <InfoRow label="District" value={hospital.district} />
            <InfoRow label="Sector" value={hospital.sector} />
            <InfoRow label="Cell" value={hospital.cell} />
          </CardContent>
        </Card>

        {/* Affiliated Users */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4 text-violet-500" />
              Affiliated Users
              {hospital.users && hospital.users.length > 0 && (
                <span className="ml-auto inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {hospital.users.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AffiliatedUsers users={hospital.users ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Registration meta */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          <span className="font-medium text-slate-600">Registered:</span>{" "}
          {formatDate(hospital.createdAt)}
        </span>
        <span>
          <span className="font-medium text-slate-600">Last updated:</span>{" "}
          {formatDate(hospital.updatedAt)}
        </span>
      </div>
    </div>
  );
}
