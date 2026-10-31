"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FieldGrid, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, uid } from "@/features/admissions/utils";
import { LEAVE_TYPES, localToday, schoolDaysBetween } from "@/features/students/demoData/profile-data";
import { useStudentAdminStore } from "@/features/students/store/student-admin.store";
import type { LeaveRequest, LeaveType, Student, WeekendPlan } from "@/features/students/types/types";
import { toast } from "@/store/toast.store";

type Props = { student: Student; classTeacher: string; requests: LeaveRequest[]; weekend: WeekendPlan; onClose: () => void };

/** Student asks for leave; the class teacher recommends it, then the office decides. */
export function ApplyLeaveDialog({ student, classTeacher, requests, weekend, onClose }: Props) {
  const addLeave = useStudentAdminStore((s) => s.addLeave);
  const today = localToday();
  const [type, setType] = useState<LeaveType>("sick");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const days = to >= from ? schoolDaysBetween(from, to, weekend).length : 0;

  function submit() {
    const next: Record<string, string> = {};
    if (from < today) next.from = "Leave can't start in the past — ask your class teacher to record past absences.";
    if (to < from) next.to = "The last day must be on or after the first day.";
    else if (days === 0) next.to = "These dates are all days off.";
    else if (days > 15) next.to = "For more than 15 school days, your guardian must apply at the office.";
    const clash = requests.find((r) => r.stage !== "rejected" && r.from <= to && r.to >= from);
    if (!next.to && clash) next.to = `Overlaps your request for ${formatDate(clash.from)} → ${formatDate(clash.to)}.`;
    if (reason.trim().length < 10) next.reason = "Explain the reason in a sentence or two.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const request: LeaveRequest = {
      id: `LV-${uid()}`,
      studentId: student.id,
      type,
      from,
      to,
      reason: reason.trim(),
      submittedAt: new Date().toISOString(),
      submittedBy: "Student portal",
      stage: "teacher",
    };
    addLeave(request, "Leave requested from the student portal", student.name);
    toast("Leave request sent", { description: `${days} school day(s) · waiting for ${classTeacher}` });
    onClose();
  }

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Ask for leave"
      description={`Your class teacher (${classTeacher}) reviews it first, then the school office decides. Your guardian is told by SMS.`}
      icon={
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <CalendarPlus className="h-5 w-5" />
        </span>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>Send request</Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Type" required>
          <Select value={type} onChange={(e) => setType(e.target.value as LeaveType)}>
            {(Object.keys(LEAVE_TYPES) as LeaveType[]).map((t) => (
              <option key={t} value={t}>
                {LEAVE_TYPES[t]}
              </option>
            ))}
          </Select>
        </FormField>
        <FieldGrid>
          <FormField label="From" required error={errors.from}>
            <Input type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} invalid={Boolean(errors.from)} />
          </FormField>
          <FormField label="To" required error={errors.to} hint={days ? `${days} school day(s)` : undefined}>
            <Input type="date" min={from} value={to} onChange={(e) => setTo(e.target.value)} invalid={Boolean(errors.to)} />
          </FormField>
        </FieldGrid>
        <FormField label="Reason" required error={errors.reason}>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} invalid={Boolean(errors.reason)} placeholder="e.g. Fever — the doctor advised two days of rest." />
        </FormField>
      </div>
    </Dialog>
  );
}
