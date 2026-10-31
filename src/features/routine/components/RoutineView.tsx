"use client";

import { Coffee, Printer } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartTooltip, useTooltip } from "@/components/ui/tooltip";
import { weeklyOffLabel } from "@/features/students/components/profile/admin/WeekendDialog";
import { localToday, minutesToTime, weekdayOf } from "@/features/students/demoData/profile-data";
import { DAY_NAMES, PERIOD_MINUTES, PERIODS_PER_DAY, ROUTINE_DAYS } from "@/features/teachers/demoData/mock-data";
import { cn } from "@/lib/utils";

import { useMyRoutine } from "../hooks/use-my-routine";

const SUBJECT_TONES = [
  "bg-indigo-50 text-indigo-700 ring-indigo-200/70",
  "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
  "bg-amber-50 text-amber-700 ring-amber-200/70",
  "bg-violet-50 text-violet-700 ring-violet-200/70",
  "bg-sky-50 text-sky-700 ring-sky-200/70",
  "bg-rose-50 text-rose-700 ring-rose-200/70",
  "bg-teal-50 text-teal-700 ring-teal-200/70",
  "bg-orange-50 text-orange-700 ring-orange-200/70",
  "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200/70",
];

/**
 * The section's weekly timetable (days × periods). Read-only.
 * TODO (backend phase): GET /me/routine
 */
export function RoutineView() {
  const { student, section, profile, routine, weekend, hydrated } = useMyRoutine();
  const tip = useTooltip();
  if (!hydrated || !student || !profile || !routine || !section) return <div className="h-[520px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;

  const days = ROUTINE_DAYS.filter((d) => !weekend.days.includes(d));
  const todayDay = weekdayOf(localToday());
  const subjects = [...new Set(routine.map((r) => r.subject))];
  const toneOf = (subject: string) => SUBJECT_TONES[subjects.indexOf(subject) % SUBJECT_TONES.length]!;
  const periods = Array.from({ length: PERIODS_PER_DAY }, (_, i) => i + 1);
  const time = (p: number) => {
    const start = profile.shift.start + (p - 1) * PERIOD_MINUTES;
    return `${minutesToTime(start)} – ${minutesToTime(start + PERIOD_MINUTES)}`;
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Class Routine"
        description={`${student.className} · Section ${student.section} · ${profile.shift.name} shift · room ${section.settings.room || "—"} · weekly off: ${weeklyOffLabel(weekend)}.`}
        actions={
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-subtle/70 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                <th className="w-32 border-b border-line px-4 py-3 text-left">Day</th>
                {periods.map((p) => (
                  <th key={p} className="border-b border-l border-line px-3 py-3 text-left">
                    <span className="block text-fg">Period {p}</span>
                    <span className="block font-medium normal-case tracking-normal text-fg-subtle">{time(p)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const isToday = day === todayDay;
                return (
                  <tr key={day} className={cn(isToday && "bg-indigo-50/40 dark:bg-indigo-500/5")}>
                    <th className="border-b border-line px-4 py-3 text-left">
                      <span className="font-semibold text-fg">{DAY_NAMES[day]}</span>
                      {isToday && <span className="ml-2 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Today</span>}
                    </th>
                    {periods.map((p) => {
                      const slot = routine.find((r) => r.day === day && r.period === p);
                      return (
                        <td key={p} className="h-20 border-b border-l border-line p-1.5 align-top">
                          {slot ? (
                            <div
                              tabIndex={0}
                              {...tip.trigger(<ChartTooltip title={slot.subject} subtitle={`${DAY_NAMES[day]} · period ${p}`} rows={[{ label: "Time", value: time(p) }, { label: "Teacher", value: slot.teacher }]} />)}
                              className={cn("h-full cursor-default rounded-xl px-2.5 py-2 ring-1 ring-inset transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-indigo-500", toneOf(slot.subject))}
                            >
                              <p className="truncate text-xs font-bold">{slot.subject}</p>
                              <p className="mt-0.5 truncate text-[11px] font-medium opacity-80">{slot.teacher}</p>
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center rounded-xl text-fg-subtle/60">
                              <Coffee className="h-4 w-4" aria-label="Free period" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {tip.node}
    </div>
  );
}
