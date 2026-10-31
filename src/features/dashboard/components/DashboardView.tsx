"use client";

import { DashboardEvents } from "@/features/events/components/DashboardEvents";
import { DashboardNotices } from "@/features/notices/components/DashboardNotices";
import { useMyRoutine } from "@/features/routine/hooks/use-my-routine";
import { summarize } from "@/features/students/components/profile/attendance-utils";
import { TodayCard } from "@/features/students/components/profile/TodayCard";

import { useTodaySchedule } from "../hooks/use-today";
import { FeesCard } from "./FeesCard";
import { LatestResultCard } from "./LatestResultCard";
import { StudentWelcome } from "./StudentWelcome";
import { TodaySchedule } from "./TodaySchedule";

/** The student's home page. */
export function DashboardView() {
  const { student, profile, tuition, weekend, routine, hydrated } = useMyRoutine();
  const { today, off, periods } = useTodaySchedule(routine, profile?.shift.start, weekend);
  if (!student || !profile || !tuition || !hydrated) return <DashboardSkeleton />;
  const rate = summarize(profile.attendance.filter((d) => d.date.startsWith(today.slice(0, 4)))).rate;
  const latest = profile.exams.filter((e) => e.status === "published").at(-1);

  return (
    <div className="animate-fade-up space-y-6">
      <StudentWelcome
        name={student.name}
        classLabel={`${student.className} · Section ${student.section} · Roll ${student.roll}`}
        classesToday={periods.length}
        attendanceRate={rate}
        gpa={latest ? latest.gpa.toFixed(2) : "—"}
        feesDue={tuition.outstanding}
        off={off}
        today={today}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TodaySchedule periods={periods} off={off} />
        </div>
        <TodayCard days={profile.attendance} shift={profile.shift} weekend={weekend} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LatestResultCard exam={latest} />
        <FeesCard ledger={tuition} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardNotices />
        <DashboardEvents />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-64 animate-pulse rounded-3xl bg-soft" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-soft xl:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl bg-soft" />
      </div>
    </div>
  );
}
