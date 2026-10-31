"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip, useTooltip } from "@/components/ui/tooltip";
import { gradeTone } from "@/features/students/components/profile/grade-utils";
import type { ExamResult } from "@/features/students/types/types";
import { cn } from "@/lib/utils";

/** Latest published exam: GPA, position and a mini bar per subject. */
export function LatestResultCard({ exam }: { exam: ExamResult | undefined }) {
  const tip = useTooltip();
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Latest result</CardTitle>
          <CardDescription>{exam ? exam.name : "No results yet"}</CardDescription>
        </div>
        <Link href="/results" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          All results <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      {!exam ? (
        <EmptyState icon={Trophy} title="No results yet" description="Results appear here as soon as the school publishes them." />
      ) : (
        <div className="p-6 pt-4">
          <div className="flex items-center gap-4 rounded-2xl bg-subtle p-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm">
              <Trophy className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-2xl font-bold tabular-nums text-fg">
                {exam.gpa.toFixed(2)} <span className="text-sm font-medium text-fg-muted">GPA</span>
              </p>
              <p className="text-xs text-fg-muted">
                Position {exam.position} of {exam.classSize} · {exam.total}/{exam.outOf} marks
              </p>
            </div>
            <Badge tone={gradeTone(exam.grade)}>{exam.grade}</Badge>
          </div>
          <ul className="mt-4 space-y-2.5">
            {exam.results.map((r) => {
              const pct = Math.round((r.obtained / r.fullMarks) * 100);
              return (
                <li
                  key={r.code}
                  tabIndex={0}
                  {...tip.trigger(
                    <ChartTooltip
                      title={r.subject}
                      subtitle={`${pct}% · grade ${r.grade} (${r.gp.toFixed(1)})`}
                      rows={[
                        { label: "Your marks", value: `${r.obtained}/${r.fullMarks}`, color: "bg-indigo-500" },
                        { label: "Highest in class", value: r.highest, color: "bg-amber-400" },
                      ]}
                    />,
                  )}
                  className="group/row rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-fg-secondary">{r.subject}</span>
                    <span className="font-semibold tabular-nums text-fg">{r.grade}</span>
                  </div>
                  <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-soft transition-[height] group-hover/row:h-2">
                    <div className={cn("h-full rounded-full", r.gp === 0 ? "bg-rose-500" : "bg-indigo-500")} style={{ width: `${pct}%` }} />
                    <span className="absolute inset-y-0 w-0.5 bg-amber-400" style={{ left: `${Math.round((r.highest / r.fullMarks) * 100)}%` }} aria-hidden />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[11px] text-fg-subtle">Yellow tick = highest mark in your class. Hover a subject for details.</p>
        </div>
      )}
      {tip.node}
    </Card>
  );
}
