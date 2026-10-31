"use client";

import { useMemo } from "react";

import { sectionSlug } from "@/features/classes/demoData/mock-data";
import { useSection } from "@/features/classes/hooks/use-section";
import { useStudent } from "@/features/students/hooks/use-student";
import { useStudents } from "@/features/students/hooks/use-students";
import { studentSlug } from "@/features/students/utils";

import { useSessionHydrated, useSessionStore } from "../store/session.store";

/**
 * The signed-in student with everything the portal shows: profile
 * (subjects, results, attendance, guardians), tuition, leave, account and
 * their section (class teacher, weekly routine).
 * TODO (backend phase): GET /me (+ /me/attendance, /me/results, /me/fees …)
 */
export function useCurrentStudent() {
  const sessionReady = useSessionHydrated();
  const studentId = useSessionStore((s) => s.studentId);
  const { students } = useStudents();
  // Students who have left (transfer certificate issued) can't use the portal.
  const me = useMemo(() => students.find((s) => s.id === studentId && s.status !== "left"), [students, studentId]);
  const data = useStudent(me ? studentSlug(me) : "");
  const section = useSection(me ? sectionSlug(me.className, me.section) : "");

  return {
    ...data,
    /** The student's section with its weekly routine grid. */
    section: section.section,
    grid: section.grid,
    hydrated: sessionReady && data.hydrated && section.hydrated,
    signedIn: Boolean(studentId),
    student: me ? data.student : undefined,
  };
}
