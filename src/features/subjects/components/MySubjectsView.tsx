"use client";

import { Crown, Mail, Phone } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";
import { gradeTone } from "@/features/students/components/profile/grade-utils";

/**
 * The student's subjects with their teachers and the latest grade per subject.
 * TODO (backend phase): GET /me/subjects
 */
export function MySubjectsView() {
  const { student, profile, hydrated } = useCurrentStudent();
  if (!hydrated || !student || !profile) return <div className="h-[480px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;
  const latest = profile.exams.filter((e) => e.status === "published").at(-1);
  const ct = profile.classTeacher;

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="My Subjects" description={`${profile.subjects.length} subjects this session · ${student.className} · Section ${student.section}`} />

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <Avatar name={ct.name} size="lg" className="bg-linear-to-br from-amber-400 to-orange-500 text-white" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600">
            <Crown className="h-3.5 w-3.5" />
            Class teacher
          </p>
          <p className="text-lg font-semibold text-fg">{ct.name}</p>
          <p className="text-sm text-fg-muted">
            {ct.designation} · {ct.subject}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${ct.phone}`} className={buttonStyles({ variant: "outline", size: "icon" })} aria-label={`Call ${ct.name}`} title={ct.phone}>
            <Phone className="h-4 w-4" />
          </a>
          <a href={`mailto:${ct.email}`} className={buttonStyles({ variant: "outline", size: "icon" })} aria-label={`Email ${ct.name}`} title={ct.email}>
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {profile.subjects.map((s) => {
          const result = latest?.results.find((r) => r.code === s.code);
          return (
            <Card key={s.code} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-semibold text-fg-subtle">{s.code}</p>
                  <p className="font-semibold text-fg">{s.name}</p>
                  <p className="mt-0.5 text-xs text-fg-muted">{s.periodsPerWeek} periods a week</p>
                </div>
                {result ? <Badge tone={gradeTone(result.grade)}>{result.grade}</Badge> : s.custom && <Badge tone="violet">Extra</Badge>}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <Avatar name={s.teacher.name} size="md" className="bg-indigo-50 text-indigo-700" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{s.teacher.name}</p>
                  <p className="truncate text-xs text-fg-muted">{s.teacher.designation}</p>
                </div>
                <a href={`mailto:${s.teacher.email}`} className="rounded-lg p-1.5 text-fg-subtle transition hover:bg-soft hover:text-indigo-600" aria-label={`Email ${s.teacher.name}`} title={s.teacher.email}>
                  <Mail className="h-4 w-4" />
                </a>
              </div>
              {result && (
                <p className="mt-3 text-xs text-fg-muted">
                  {latest!.name}: <span className="font-semibold tabular-nums text-fg">{result.obtained}/{result.fullMarks}</span> · highest {result.highest}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
