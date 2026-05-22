export interface Role {
  value: string;
  label: string;
  route: string;
}

export const roles: Role[] = [
  { value: "ADMIN", label: "Admin", route: "/admin/dashboard" },
  {
    value: "COORDINATOR",
    label: "Coordinator",
    route: "/coordinator/dashboard",
  },
  {
    value: "HOSPITAL_ADMIN",
    label: "Hospital Admin",
    route: "/hospital-admin/dashboard",
  },
];
