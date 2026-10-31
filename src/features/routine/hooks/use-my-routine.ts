"use client";

import { useMemo } from "react";

import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";
import type { RoutinePeriod } from "@/features/dashboard/hooks/use-today";
import { RELIGION_SUBJECTS } from "@/features/students/demoData/profile-data";

/**
 * The student's weekly routine: their section's timetable, with the shared
 * religion period resolved to the student's own religion subject and teacher.
 * TODO (backend phase): GET /me/routine
 */
export function useMyRoutine() {
  const me = useCurrentStudent();
  const { grid, profile, weekend } = me;

  const routine = useMemo<RoutinePeriod[] | undefined>(() => {
    if (!grid || !profile) return undefined;
    const religion = profile.subjects.find((s) => RELIGION_SUBJECTS.includes(s.name));
    return grid
      .filter((c) => c.cell && !weekend.days.includes(c.day))
      .map((c) => {
        const isReligion = c.cell!.subject.includes("Religion") || RELIGION_SUBJECTS.includes(c.cell!.subject);
        // Subject teacher as shown on the student's profile (admin may have changed it).
        const own = profile.subjects.find((s) => s.name === c.cell!.subject);
        return {
          day: c.day,
          period: c.period,
          subject: isReligion && religion ? religion.name : c.cell!.subject,
          teacher: isReligion && religion ? religion.teacher.name : (c.cell!.teacherName || own?.teacher.name || "—"),
        };
      });
  }, [grid, profile, weekend]);

  return { ...me, routine };
}
