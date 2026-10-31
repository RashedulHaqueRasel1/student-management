"use client";

import { useState } from "react";
import { Award, FileBadge2, Hash, Sigma, Trophy } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartTooltip, useTooltip } from "@/components/ui/tooltip";
import { formatDate } from "@/features/admissions/utils";
import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";
import { useExams } from "@/features/examinations/hooks/use-exams";
import { gradeTone } from "@/features/students/components/profile/grade-utils";
import { cn } from "@/lib/utils";

/**
 * Published results: GPA trend across exams, then one exam's marks by subject.
 * TODO (backend phase): GET /me/results
 */
export function MyResultsView() {
  const { student, profile, hydrated } = useCurrentStudent();
  const { exams: schoolExams } = useExams();
  const [picked, setPicked] = useState<string | null>(null);
  const trend = useTooltip();
  const bars = useTooltip();
  if (!hydrated || !student || !profile) return <div className="h-[480px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;

  const published = profile.exams.filter((e) => e.status === "published");
  const upcoming = profile.exams.filter((e) => e.status === "upcoming");
  const exam = published.find((e) => e.id === picked) ?? published.at(-1);
  const header = <PageHeader title="Results" description="Your published exam results. Marks are final once published — talk to your subject teacher about any mistake." />;

  if (!exam) {
    return (
      <div className="animate-fade-up">
        {header}
        <Card>
          <EmptyState icon={Trophy} title="No results yet" description="Results appear here as soon as the school publishes them." />
        </Card>
      </div>
    );
  }

  const slug = schoolExams.find((e) => e.id === exam.id)?.slug;
  const tiles = [
    { label: "GPA", value: exam.gpa.toFixed(2), icon: Trophy, accent: "bg-amber-50 text-amber-600" },
    { label: "Grade", value: exam.grade, icon: Award, accent: "bg-emerald-50 text-emerald-600" },
    { label: "Position", value: `${exam.position} / ${exam.classSize}`, icon: Hash, accent: "bg-indigo-50 text-indigo-600" },
    { label: "Total marks", value: `${exam.total} / ${exam.outOf}`, icon: Sigma, accent: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      {header}

      {published.length > 1 && (
        <Card className="p-5 sm:p-6">
          <h2 className="text-[15px] font-semibold tracking-tight text-fg">GPA across exams</h2>
          <p className="mt-0.5 text-xs text-fg-muted">Hover a bar for details, click to open that exam below.</p>
          <div className="group/chart mt-6 flex h-48 items-end gap-3 sm:gap-6">
            {published.map((e, i) => {
              const prev = published[i - 1];
              const active = e.id === exam.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setPicked(e.id)}
                  aria-label={`${e.name}: GPA ${e.gpa.toFixed(2)}`}
                  {...trend.trigger(
                    <ChartTooltip
                      title={e.name}
                      subtitle={`Held on ${formatDate(e.heldOn)}`}
                      rows={[
                        { label: "GPA", value: e.gpa.toFixed(2), color: "bg-indigo-500" },
                        { label: "Grade", value: e.grade },
                        { label: "Position", value: `${e.position} of ${e.classSize}` },
                        ...(prev ? [{ label: "vs previous", value: `${e.gpa >= prev.gpa ? "▲" : "▼"} ${Math.abs(e.gpa - prev.gpa).toFixed(2)}` }] : []),
                      ]}
                    />,
                  )}
                  className="group/bar flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 group-hover/chart:opacity-45 hover:opacity-100!"
                >
                  <span className="text-xs font-bold tabular-nums text-fg">{e.gpa.toFixed(2)}</span>
                  <span
                    className={cn(
                      "w-full max-w-16 rounded-t-xl bg-linear-to-t transition-transform duration-200 group-hover/bar:scale-x-105",
                      e.gpa === 0 ? "from-rose-500 to-rose-400" : "from-indigo-600 to-violet-400",
                      active && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-surface",
                    )}
                    style={{ height: `${Math.max(4, (e.gpa / 5) * 100)}%` }}
                  />
                  <span className={cn("max-w-full truncate text-xs font-medium", active ? "text-indigo-600" : "text-fg-muted")}>{e.name.replace(" Exam", "")}</span>
                </button>
              );
            })}
          </div>
          {trend.node}
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {published.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setPicked(e.id)}
            aria-pressed={e.id === exam.id}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-sm font-semibold transition",
              e.id === exam.id ? "border-indigo-500 bg-linear-to-b from-indigo-500 to-indigo-600 text-white shadow-glow" : "border-line bg-surface text-fg-secondary hover:bg-soft hover:text-fg",
            )}
          >
            {e.name}
          </button>
        ))}
        {upcoming.map((e) => (
          <span key={e.id} className="rounded-xl border border-dashed border-line px-3.5 py-2 text-sm font-medium text-fg-subtle">
            {e.name} · not published yet
          </span>
        ))}
        {slug && (
          <a href={`/report-cards/${slug}`} target="_blank" rel="noopener" className={buttonStyles({ variant: "outline", className: "ml-auto" })}>
            <FileBadge2 className="h-4 w-4" />
            Report card
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {tiles.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", accent)}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-fg-muted">{label}</p>
              <p className="text-2xl font-bold tabular-nums tracking-tight text-fg">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <h2 className="text-[15px] font-semibold tracking-tight text-fg">{exam.name} · subject marks</h2>
          <p className="mt-0.5 text-xs text-fg-muted">Bar = your marks · yellow tick = highest in your class.</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-y border-line bg-subtle/70 text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                <th className="py-3 pl-5 pr-3 sm:pl-6">Subject</th>
                <th className="w-[38%] px-3 py-3">Marks</th>
                <th className="px-3 py-3 text-right">Obtained</th>
                <th className="px-3 py-3 text-right">Highest</th>
                <th className="py-3 pl-3 pr-5 text-right sm:pr-6">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {exam.results.map((r) => {
                const pct = Math.round((r.obtained / r.fullMarks) * 100);
                const pass = Math.round(r.fullMarks * 0.33);
                return (
                  <tr key={r.code}>
                    <td className="py-3 pl-5 pr-3 sm:pl-6">
                      <p className="font-semibold text-fg">{r.subject}</p>
                      <p className="font-mono text-[11px] text-fg-subtle">{r.code}</p>
                    </td>
                    <td className="px-3 py-3">
                      <div
                        tabIndex={0}
                        {...bars.trigger(
                          <ChartTooltip
                            title={r.subject}
                            subtitle={`${pct}% · grade ${r.grade} (${r.gp.toFixed(1)} GP)`}
                            rows={[
                              { label: "Your marks", value: `${r.obtained}/${r.fullMarks}`, color: r.gp === 0 ? "bg-rose-500" : "bg-indigo-500" },
                              { label: "Highest in class", value: r.highest, color: "bg-amber-400" },
                              { label: "Pass marks", value: pass, color: "bg-slate-400" },
                              { label: "Behind the top", value: r.highest - r.obtained },
                            ]}
                          />,
                        )}
                        className="group/bar cursor-default rounded-full py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        <div className="relative h-2.5 overflow-hidden rounded-full bg-soft transition-[height] group-hover/bar:h-3">
                          <div className={cn("h-full rounded-full", r.gp === 0 ? "bg-rose-500" : "bg-linear-to-r from-indigo-500 to-violet-500")} style={{ width: `${pct}%` }} />
                          <span aria-hidden className="absolute inset-y-0 w-0.5 bg-slate-400/70" style={{ left: `${(pass / r.fullMarks) * 100}%` }} />
                          <span aria-hidden className="absolute inset-y-0 w-1 rounded-full bg-amber-400" style={{ left: `calc(${(r.highest / r.fullMarks) * 100}% - 2px)` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-fg">
                      {r.obtained}
                      <span className="font-normal text-fg-subtle">/{r.fullMarks}</span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-fg-muted">{r.highest}</td>
                    <td className="py-3 pl-3 pr-5 text-right sm:pr-6">
                      <Badge tone={gradeTone(r.grade)}>
                        {r.grade} · {r.gp.toFixed(1)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {exam.remarks && (
          <p className="border-t border-line px-5 py-4 text-sm text-fg-secondary sm:px-6">
            <span className="font-semibold text-fg">Class teacher&apos;s remarks:</span> {exam.remarks}
          </p>
        )}
        {bars.node}
      </Card>
    </div>
  );
}
