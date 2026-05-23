import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "../../hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Button } from "#components/ui/button";
import Loader from "#components/Loader";
import {
  ArrowLeft,
  Mail,
  Building2,
  CalendarDays,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { formatDate, formatRole } from "#lib/utils";
import EditUserSheet from "../../components/admin/EditUserSheet";
import { InfoRow } from "#components/InfoRow";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  HOSPITAL_ADMIN: "bg-blue-50 text-blue-700",
  COORDINATOR: "bg-amber-50 text-amber-700",
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUser(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !user) {
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
        <p className="text-red-600">User not found or failed to load.</p>
      </div>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const roleColor = roleColors[user.role] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <Button
        variant="link"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-0"
      >
        <ArrowLeft className="size-4" />
        Back to Users
      </Button>

      {/* Header */}
      <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-950 truncate">
            {user.prefix ? `${user.prefix} ` : ""}
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${roleColor}`}
          >
            {formatRole(user.role)}
          </span>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              user.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {user.isActive ? "Active" : "Disabled"}
          </span>
          <EditUserSheet user={user} />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="size-4 text-indigo-500" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow label="Prefix" value={user.prefix} />
            <InfoRow label="First Name" value={user.firstName} />
            <InfoRow label="Last Name" value={user.lastName} />
            <InfoRow
              label="Email"
              value={
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline"
                >
                  <Mail className="size-3.5" />
                  {user.email}
                </a>
              }
            />
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-violet-500" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow
              label="Role"
              value={
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor}`}
                >
                  {formatRole(user.role)}
                </span>
              }
            />
            <InfoRow
              label="Verification"
              value={
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.isVerified
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {user.isVerified ? "Verified" : "Pending verification"}
                </span>
              }
            />
            <InfoRow
              label="Status"
              value={
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Disabled"}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* Hospital */}
        {user.hospital && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-4 text-blue-500" />
                Affiliated Hospital
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoRow label="Hospital Name" value={user.hospital.name} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          <span className="font-medium text-slate-600">Created:</span>{" "}
          {formatDate(user.createdAt)}
        </span>
        <span>
          <span className="font-medium text-slate-600">Last updated:</span>{" "}
          {formatDate(user.updatedAt)}
        </span>
      </div>
    </div>
  );
}
