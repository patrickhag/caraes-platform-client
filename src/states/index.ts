import { create } from "zustand";

export const useUserRoleStore = create((set) => ({
  userRole: null,
  setUserRole: (role: string | null) => set({ userRole: role }),
}));
