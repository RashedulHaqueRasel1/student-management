"use client";

import { useState } from "react";
import { AlertTriangle, Armchair, ClipboardList, FileBadge2, Printer } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatTaka } from "@/features/admissions/utils";
import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";
import { WEEKDAY_NAMES, localToday, weekdayOf } from "@/features/students/demoData/profile-data";
import { cn } from "@/lib/utils";

import { WITHHOLD_AFTER_MONTHS, useExam } from "../hooks/use-exam";
import { useExams } from "../hooks/use-exams";
import type { ExamStatus } from "../types/types";
import { hours, timeRange } from "../utils";

/** Student-facing exam status. */
const STATUS: Record<ExamStatus, { label: string; tone: "info" | "warning" | "neutral" | "success" | "danger" }> = {
  scheduled: { label: "Upcoming", tone: "info" },
  ongoing: { label: "Running now", tone: "warning" },
  completed: { label: "Results coming", tone: "neutral" },
  published: { label: "Results out", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

/**
 * Exams of the student's class: routine, seat and admit card.
 * TODO (backend phase): GET /me/exams · GET /me/exams/:id (papers, seat, admit card status)
 */
export function MyExamsView() {
  const { student, profile, hydrated } = useCurrentStudent();
  const { exams: all, hydrated: examsReady } = useExams();
  const [picked, setPicked] = useState<string | null>(null);
  const exams = student ? all.filter((e) => e.classes.includes(student.className)) : [];
  // Default: the running exam, else the next one, else the latest.
  const exam = exams.find((e) => e.id === picked) ?? exams.find((e) => e.status === "ongoing") ?? exams.find((e) => e.status === "scheduled") ?? exams.at(-1);
  const detail = useExam(exam?.slug ?? "");
  const header = <PageHeader title="Exams" description="Exam routine, your seat and admit card. Bring your admit card to every paper." />;

  if (!hydrated || !examsReady || !student || !profile) return <div className="h-[480px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;
  if (!exam) {
    return (
      <div className="animate-fade-up">
        {header}
        <Card>
          <EmptyState icon={ClipboardList} title="No exams yet" description="Exams for your class appear here once the school schedules them." />
        </Card>
      </div>
    );
  }

  // One shared religion paper per class; the student sits their own religion in it.
  const papers = exam.papers.filter((p) => p.className === student.className);
  const me = detail.candidates?.find((c) => c.student.id === student.id);
  const today = localToday();
  const open = exam.status === "scheduled" || exam.status === "ongoing";

  return (
    <div className="animate-fade-up space-y-6">
      {header}

      <div className="flex flex-wrap gap-2">
        {exams.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setPicked(e.id)}
            aria-pressed={e.id === exam.id}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-left text-sm font-semibold transition",
              e.id === exam.id ? "border-indigo-500 bg-linear-to-b from-indigo-500 to-indigo-600 text-white shadow-glow" : "border-line bg-surface text-fg-secondary hover:bg-soft hover:text-fg",
            )}
          >
            {e.name}
            <span className={cn("block text-[11px] font-medium", e.id === exam.id ? "text-indigo-100" : "text-fg-muted")}>{STATUS[e.status].label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-fg">{exam.name}</h2>
              <p className="mt-0.5 text-sm text-fg-muted">
                {formatDate(exam.days[0] ?? exam.startDate)} → {formatDate(exam.endDate)}
              </p>
            </div>
            <Badge tone={STATUS[exam.status].tone} dot>
              {STATUS[exam.status].label}
            </Badge>
          </div>
          {exam.cancelled && <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700">Cancelled: {exam.cancelled.reason}</p>}
          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">Papers</dt>
              <dd className="font-semibold text-fg">{papers.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-muted">Full · pass marks</dt>
              <dd className="font-semibold text-fg">
                {exam.fullMarks} · {exam.passMarks}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1.5 text-fg-muted">
                <Armchair className="h-4 w-4" />
                Your seat
              </dt>
              <dd className="font-semibold text-fg">{me?.room ? `${me.room} · seat ${me.seat}` : "—"}</dd>
            </div>
          </dl>

          {open && me && !me.eligible && (
            <p className="mt-5 flex gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Admit card withheld: {me.monthsDue} months of tuition ({formatTaka(me.due)}) unpaid. Cards are held from {WITHHOLD_AFTER_MONTHS} unpaid months — ask your guardian to clear the dues.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-2">
            {open && me?.eligible && (
              <a href={`/admit-cards/${exam.slug}`} target="_blank" rel="noopener" className={buttonStyles()}>
                <Printer className="h-4 w-4" />
                Print admit card
              </a>
            )}
            {exam.status === "published" && (
              <a href={`/report-cards/${exam.slug}`} target="_blank" rel="noopener" className={buttonStyles({ variant: "outline" })}>
                <FileBadge2 className="h-4 w-4" />
                Report card
              </a>
            )}
          </div>
          {exam.instructions && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Instructions</p>
              <p className="mt-2 whitespace-pre-line text-sm text-fg-secondary">{exam.instructions}</p>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden xl:col-span-2">
          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            <h2 className="text-[15px] font-semibold tracking-tight text-fg">Exam routine · {student.className}</h2>
            <p className="mt-0.5 text-xs text-fg-muted">Be in your seat 15 minutes before each paper.</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] whitespace-nowrap text-sm">
              <thead>
                <tr className="border-y border-line bg-subtle/70 text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                  <th className="py-3 pl-5 pr-3 sm:pl-6">Date</th>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Time</th>
                  <th className="py-3 pl-3 pr-5 sm:pr-6">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {papers.map((p) => {
                  const past = p.date < today;
                  const isToday = p.date === today;
                  return (
                    <tr key={p.id} className={cn(past && "text-fg-subtle", isToday && "bg-amber-50/60 dark:bg-amber-500/10")}>
                      <td className="py-3 pl-5 pr-3 sm:pl-6">
                        <p className={cn("font-medium", past ? "text-fg-subtle" : "text-fg")}>{formatDate(p.date)}</p>
                        <p className="text-xs text-fg-muted">{WEEKDAY_NAMES[weekdayOf(p.date)]}</p>
                      </td>
                      <td className={cn("px-3 py-3 font-semibold", past ? "text-fg-subtle" : "text-fg")}>
                        {p.subject}
                        {isToday && (
                          <Badge tone="warning" className="ml-2">
                            Today
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-fg-secondary">{timeRange(p)}</td>
                      <td className="py-3 pl-3 pr-5 tabular-nums text-fg-muted sm:pr-6">{hours(p.duration)}</td>
                    </tr>
                  );
                })}
                {papers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-fg-muted">
                      No papers scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
