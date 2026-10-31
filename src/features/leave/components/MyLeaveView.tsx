"use client";

import { useState } from "react";
import { CalendarPlus, CalendarRange, Check, Undo2, X } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/features/admissions/utils";
import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";
import { LEAVE_TYPES, schoolDaysBetween } from "@/features/students/demoData/profile-data";
import { useStudentAdminStore } from "@/features/students/store/student-admin.store";
import type { LeaveRequest, LeaveStage } from "@/features/students/types/types";
import { cn } from "@/lib/utils";
import { confirmAction } from "@/store/confirm.store";
import { toast } from "@/store/toast.store";

import { ApplyLeaveDialog } from "./ApplyLeaveDialog";

const STAGE: Record<LeaveStage, { label: string; tone: BadgeTone }> = {
  teacher: { label: "With class teacher", tone: "warning" },
  admin: { label: "With the office", tone: "info" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

/**
 * The student's leave requests: ask, follow the approval steps, withdraw.
 * BACKEND: GET /me/leave-requests · POST /me/leave-requests · DELETE /me/leave-requests/:id
 */
export function MyLeaveView() {
  const { student, profile, leaveRequests = [], weekend, hydrated } = useCurrentStudent();
  const created = useStudentAdminStore((s) => s.leaveRequests);
  const withdrawLeave = useStudentAdminStore((s) => s.withdrawLeave);
  const [applying, setApplying] = useState(false);
  if (!hydrated || !student || !profile) return <div className="h-[480px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;

  async function withdraw(r: LeaveRequest) {
    const ok = await confirmAction({ title: "Withdraw this request?", description: `${LEAVE_TYPES[r.type]} · ${formatDate(r.from)} → ${formatDate(r.to)}`, confirmLabel: "Withdraw", tone: "danger" });
    if (!ok) return;
    withdrawLeave(r, student!.name);
    toast("Leave request withdrawn");
  }

  const counts = {
    waiting: leaveRequests.filter((r) => r.stage === "teacher" || r.stage === "admin").length,
    approved: leaveRequests.filter((r) => r.stage === "approved").length,
    days: leaveRequests.filter((r) => r.stage === "approved").reduce((sum, r) => sum + schoolDaysBetween(r.from, r.to, weekend).length, 0),
  };

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Leave Requests"
        description={`Ask for leave before you miss school. ${profile.classTeacher.name} (class teacher) reviews it first, then the office.`}
        actions={
          <Button onClick={() => setApplying(true)}>
            <CalendarPlus className="h-4 w-4" />
            Ask for leave
          </Button>
        }
      />

      <Card className="grid grid-cols-3 divide-x divide-line">
        {(
          [
            ["Waiting", counts.waiting, "text-amber-600"],
            ["Approved", counts.approved, "text-emerald-600"],
            ["School days on leave", counts.days, "text-violet-600"],
          ] as const
        ).map(([label, value, cls]) => (
          <div key={label} className="px-5 py-4">
            <p className="text-xs font-medium text-fg-muted">{label}</p>
            <p className={cn("mt-1 text-2xl font-bold tabular-nums", cls)}>{value}</p>
          </div>
        ))}
      </Card>

      {leaveRequests.length === 0 ? (
        <Card>
          <EmptyState icon={CalendarRange} title="No leave requests" description="Requests you send appear here with each approval step." />
        </Card>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((r) => {
            const days = schoolDaysBetween(r.from, r.to, weekend).length;
            const mine = created.some((c) => c.id === r.id);
            return (
              <Card key={r.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-fg">{LEAVE_TYPES[r.type]}</p>
                      <Badge tone={STAGE[r.stage].tone} dot>
                        {STAGE[r.stage].label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-fg-secondary">
                      {formatDate(r.from)}
                      {r.to !== r.from && ` → ${formatDate(r.to)}`} · {days} school day{days === 1 ? "" : "s"}
                    </p>
                    <p className="mt-1 text-sm text-fg-muted">&ldquo;{r.reason}&rdquo;</p>
                    <p className="mt-1 text-xs text-fg-subtle">
                      Sent {formatDateTime(r.submittedAt)} · {r.submittedBy}
                    </p>
                  </div>
                  {r.stage === "teacher" && mine && (
                    <Button size="sm" variant="outline" onClick={() => withdraw(r)}>
                      <Undo2 className="h-3.5 w-3.5" />
                      Withdraw
                    </Button>
                  )}
                </div>
                <Steps request={r} />
              </Card>
            );
          })}
        </div>
      )}

      {applying && weekend && (
        <ApplyLeaveDialog student={student} classTeacher={profile.classTeacher.name} requests={leaveRequests} weekend={weekend} onClose={() => setApplying(false)} />
      )}
    </div>
  );
}

/** Sent → class teacher → office, with who decided and their note. */
function Steps({ request: r }: { request: LeaveRequest }) {
  const steps = [
    { label: "Sent", done: true, failed: false, note: undefined as string | undefined, by: undefined as string | undefined },
    { label: "Class teacher", done: Boolean(r.teacherDecision), failed: r.teacherDecision?.approved === false, note: r.teacherDecision?.note, by: r.teacherDecision?.by },
    { label: "Office", done: Boolean(r.adminDecision), failed: r.adminDecision?.approved === false, note: r.adminDecision?.note, by: r.adminDecision?.by },
  ];
  return (
    <ol className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
      {steps.map((s, i) => {
        const current = !s.done && (i === 0 || steps[i - 1]!.done) && r.stage !== "rejected";
        return (
          <li key={s.label} className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  s.failed ? "bg-rose-500 text-white" : s.done ? "bg-emerald-500 text-white" : current ? "bg-amber-400 text-amber-950 ring-4 ring-amber-400/20" : "bg-soft text-fg-subtle",
                )}
              >
                {s.failed ? <X className="h-3.5 w-3.5" /> : s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("truncate text-xs font-semibold", s.done || current ? "text-fg" : "text-fg-subtle")}>{s.label}</span>
              {i < steps.length - 1 && <span className={cn("hidden h-px flex-1 sm:block", s.done && !s.failed ? "bg-emerald-400" : "bg-line-strong")} />}
            </div>
            {(s.by || current) && (
              <p className="mt-1 pl-8 text-[11px] text-fg-muted">
                {s.by ? `${s.failed ? "Rejected" : "Approved"} by ${s.by}${s.note ? ` — “${s.note}”` : ""}` : "Waiting…"}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
