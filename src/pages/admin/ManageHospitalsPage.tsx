import { RefreshCw } from "lucide-react";
import AddHospitalSheet from "../../components/admin/AddHospitalSheet";
import DataTable from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { useGetHospitals } from "../../hooks/useHospitals";
import { hospitalColumns } from "#components/admin/HospitalColumns";

export default function ManageHospitalsPage() {
  const {
    data: hospitals = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHospitals();

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-bold text-slate-950">Manage Hospitals</h1>
        <p className="text-lg text-slate-600">
          View and manage registered hospitals and facilities
        </p>
      </div>

      <DataTable
        columns={hospitalColumns}
        data={hospitals}
        emptyMessage="No hospitals found."
        error={error instanceof Error ? error : null}
        isError={isError}
        isLoading={isLoading}
        loadingMessage="Loading hospitals..."
        searchPlaceholder="Search hospitals..."
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
            <AddHospitalSheet />
          </>
        }
      />
    </div>
  );
}
