import { RefreshCw } from "lucide-react";
import AddUserSheet from "../../components/admin/AddUserSheet";
import DataTable from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { useGetUsers } from "../../hooks/useUsers";
import { userColumns } from "#components/admin/UserColumns";

export default function ManageUsers() {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsers();

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-bold text-slate-950">Manage Users</h1>
        <p className="text-lg text-slate-600">
          View and manage all system users
        </p>
      </div>

      <DataTable
        columns={userColumns}
        data={users}
        emptyMessage="No users found."
        error={error instanceof Error ? error : null}
        isError={isError}
        isLoading={isLoading}
        loadingMessage="Loading users..."
        searchPlaceholder="Search users..."
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
            <AddUserSheet />
          </>
        }
      />
    </div>
  );
}
