"use client";

import { useState } from "react";
import { GraduationCap, HeartPulse, History, KeyRound, Mail, MapPin, Phone, UserRound, UsersRound } from "lucide-react";

import { InfoCard, InfoFields } from "@/components/shared/InfoCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudentAvatar } from "@/features/admissions/components/StudentAvatar";
import { SCHOOL_INFO } from "@/features/admissions/constants";
import { ageFrom, formatDate, formatDateTime } from "@/features/admissions/utils";
import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";

import { ChangePasswordDialog } from "./ChangePasswordDialog";

/**
 * The student's own record (read-only — the office keeps it up to date) and
 * password change. TODO (backend phase): GET /me
 */
export function MyProfileView() {
  const { student, profile, account, audit = [], section, hydrated } = useCurrentStudent();
  const [changing, setChanging] = useState(false);
  if (!hydrated || !student || !profile || !account) return <div className="h-[480px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="My Profile"
        description={`Your details as the school has them. Something wrong? Ask your guardian to contact the office (${SCHOOL_INFO.phone}).`}
        actions={
          <Button variant="outline" onClick={() => setChanging(true)}>
            <KeyRound className="h-4 w-4" />
            Change password
          </Button>
        }
      />

      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <StudentAvatar name={student.name} photo={student.photo} size="xl" className="rounded-2xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-fg">{student.name}</h2>
          {profile.studentNameBn && <p className="text-sm text-fg-muted">{profile.studentNameBn}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="info">
              {student.className} · Section {student.section}
            </Badge>
            <Badge>Roll {student.roll}</Badge>
            <Badge>{student.shift} shift</Badge>
            <Badge>{student.version} version</Badge>
          </div>
          <p className="mt-3 text-xs text-fg-subtle">
            Student ID <span className="font-mono font-semibold text-fg-secondary">{student.id}</span> · portal username <span className="font-mono font-semibold text-fg-secondary">{account.username}</span> · password changed {formatDate(account.passwordChangedAt.slice(0, 10))}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InfoCard icon={UserRound} title="Personal">
          <InfoFields
            items={[
              ["Full name", student.name],
              ["Gender", student.gender],
              ["Date of birth", `${formatDate(student.dateOfBirth)} · ${ageFrom(student.dateOfBirth)} yrs`],
              ["Blood group", student.bloodGroup],
              ["Religion", profile.religion],
              ["Nationality", profile.nationality],
              ["Birth certificate", profile.birthCertificateNo],
            ]}
          />
        </InfoCard>
        <InfoCard icon={GraduationCap} title="School">
          <InfoFields
            items={[
              ["Class · section", `${student.className} · ${student.section}`],
              ["Roll", String(student.roll)],
              ["Session", profile.session],
              ["Room", section?.settings.room ?? ""],
              ["Class teacher", profile.classTeacher.name],
              ["Enrolled on", formatDate(student.enrolledOn)],
            ]}
          />
        </InfoCard>
        <InfoCard icon={MapPin} title="Address">
          <InfoFields
            items={[
              ["Present address", student.address],
              ["Permanent address", profile.permanentAddress],
            ]}
          />
          {profile.medicalNotes && (
            <div className="mt-5 rounded-xl bg-subtle p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                <HeartPulse className="h-3.5 w-3.5" />
                Medical notes
              </p>
              <p className="mt-1.5 text-sm text-fg-secondary">{profile.medicalNotes}</p>
            </div>
          )}
        </InfoCard>
        <InfoCard icon={UsersRound} title="Guardians">
          <ul className="space-y-2">
            {profile.guardians.map((g) => (
              <li key={g.role} className="flex items-center gap-3 rounded-xl border border-line p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">
                    {g.name} {g.isPrimary && <Badge tone="info">Primary</Badge>}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {g.relation} · {g.occupation}
                  </p>
                </div>
                {g.phone && (
                  <a href={`tel:${g.phone}`} className={buttonStyles({ variant: "outline", size: "icon" })} aria-label={`Call ${g.name}`} title={g.phone}>
                    <Phone className="h-4 w-4" />
                  </a>
                )}
                {g.email && (
                  <a href={`mailto:${g.email}`} className={buttonStyles({ variant: "outline", size: "icon" })} aria-label={`Email ${g.name}`} title={g.email}>
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>

      <InfoCard icon={History} title="Recent activity on your record">
        {audit.length === 0 ? (
          <p className="text-sm text-fg-subtle">No changes yet.</p>
        ) : (
          <ul className="space-y-3">
            {audit.slice(0, 8).map((e) => (
              <li key={e.id} className="flex flex-col gap-0.5 border-l-2 border-line pl-3 text-sm sm:flex-row sm:items-baseline sm:gap-3">
                <span className="font-medium text-fg">{e.action}</span>
                {e.detail && <span className="text-fg-muted">{e.detail}</span>}
                <span className="text-xs text-fg-subtle sm:ml-auto">
                  {e.by} · {formatDateTime(e.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </InfoCard>

      {changing && <ChangePasswordDialog student={student} onClose={() => setChanging(false)} />}
    </div>
  );
}
