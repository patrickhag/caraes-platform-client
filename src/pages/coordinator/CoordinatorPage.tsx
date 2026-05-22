import { RefreshCw, UserPlus } from "lucide-react";
import DataTable from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { useGetPatients } from "../../hooks/usePatients";
import { patientColumns } from "../../components/coordinator/PatientColumns";
import { useNavigate } from "react-router-dom";

export default function CoordinatorPage() {
  const navigate = useNavigate();
  const {
    data: patients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPatients();

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-bold text-slate-950">
          Manage Patients
        </h1>
        <p className="text-lg text-slate-600">
          View, monitor, and register patients in the clinic network.
        </p>
      </div>

      <DataTable
        columns={patientColumns}
        data={patients}
        emptyMessage="No patients registered yet."
        error={error instanceof Error ? error : null}
        isError={isError}
        isLoading={isLoading}
        loadingMessage="Loading patient registry..."
        searchPlaceholder="Search patients..."
        toolbarActions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/coordinator/register-patient")}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="size-4" />
              Add a patient
            </Button>
          </>
        }
      />
    </div>
  );
}
