import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
  /** ID of the signed-in student ("STU-2025-0107"), null when signed out. */
  studentId: string | null;
  signIn: (studentId: string) => void;
  signOut: () => void;
};

/**
 * Demo student session (localStorage).
 * TODO (backend phase): replace with NextAuth — the session carries the student's
 * ID and role "student", and every API call is scoped to that student server-side.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      studentId: null,
      signIn: (studentId) => set({ studentId }),
      signOut: () => set({ studentId: null }),
    }),
    { name: "student-session-demo", skipHydration: true },
  ),
);

export function useSessionHydrated() {
  const hydrated = useSyncExternalStore(
    (onChange) => useSessionStore.persist.onFinishHydration(onChange),
    () => useSessionStore.persist.hasHydrated(),
    () => false,
  );
  useEffect(() => {
    if (!useSessionStore.persist.hasHydrated()) void useSessionStore.persist.rehydrate();
  }, []);
  return hydrated;
}
