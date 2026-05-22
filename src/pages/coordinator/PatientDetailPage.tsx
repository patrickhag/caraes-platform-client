import { useNavigate, useParams } from "react-router-dom";
import { useGetPatient } from "../../hooks/usePatients";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { Button } from "#components/ui/button";
import Loader from "#components/Loader";
import {
  ArrowLeft,
  Phone,
  MapPin,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  ArrowRightLeft,
} from "lucide-react";
import type { DisabilityType, BloodType } from "../../types";
import { formatBloodType, formatDate, formatEnum } from "#lib/utils";
import { Badge } from "#components/ui/badge";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
}


export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, isError } = useGetPatient(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <p className="text-red-600">Patient not found or failed to load.</p>
      </div>
    );
  }

  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back */}
      <Button
        variant="link"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-0"
      >
        <ArrowLeft className="size-4" />
        Back to Patients list
      </Button>

      {/* Header */}
      <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-950 truncate">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {patient.gender} · DOB: {formatDate(patient.dateOfBirth)}
            {patient.nationalId && ` · National ID: ${patient.nationalId}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {patient.bloodType && (
            <Badge color="red">{formatBloodType(patient.bloodType as BloodType)}</Badge>
          )}
          {patient.requiresSpecialist && (
            <Badge color="amber">Specialist req.</Badge>
          )}
          {patient.disabilityType && (
            <Badge color="indigo">
              {formatEnum(patient.disabilityType as DisabilityType)}
            </Badge>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-4 text-indigo-500" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow label="Phone" value={patient.phoneNumber} />
            <InfoRow label="Email" value={patient.email} />
            <InfoRow label="National ID" value={patient.nationalId} />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="size-4 text-rose-500" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow label="Name" value={patient.emergencyContactName} />
            <InfoRow label="Phone" value={patient.emergencyContactPhone} />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-emerald-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow label="Province" value={patient.province} />
            <InfoRow label="District" value={patient.district} />
            <InfoRow label="Sector" value={patient.sector} />
            <InfoRow label="Cell" value={patient.cell} />
            <InfoRow label="Village" value={patient.village} />
          </CardContent>
        </Card>

        {/* Medical */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="size-4 text-red-500" />
              Medical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Blood Type"
              value={
                patient.bloodType
                  ? formatBloodType(patient.bloodType as BloodType)
                  : null
              }
            />
            <InfoRow
              label="Disability"
              value={
                patient.disabilityType
                  ? formatEnum(patient.disabilityType as DisabilityType)
                  : null
              }
            />
            <InfoRow
              label="Mobility Status"
              value={patient.mobilityStatus}
            />
            <InfoRow
              label="Specialist Required"
              value={patient.requiresSpecialist ? "Yes" : "No"}
            />
            {patient.conditionNotes && (
              <div className="col-span-2">
                <InfoRow label="Condition Notes" value={patient.conditionNotes} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Allergies & Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              Allergies &amp; Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow label="Allergies" value={patient.allergies} />
            <InfoRow label="Current Medications" value={patient.medications} />
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-blue-500" />
              Insurance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <InfoRow label="Provider" value={patient.insuranceProvider} />
            <InfoRow label="Insurance Number" value={patient.insuranceNumber} />
          </CardContent>
        </Card>
      </div>

      {/* Registration meta */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
        <span>
          <span className="font-medium text-slate-600">Registered:</span>{" "}
          {formatDate(patient.createdAt)}
        </span>
        <span>
          <span className="font-medium text-slate-600">Last updated:</span>{" "}
          {formatDate(patient.updatedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end pb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
        >
          <ArrowRightLeft className="size-4" />
          Transfer this patient
        </Button>
      </div>
    </div>
  );
}
