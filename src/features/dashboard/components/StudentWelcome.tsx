"use client";

import Link from "next/link";
import { BookOpen, CalendarCheck, CalendarClock, Sparkles, Trophy, Wallet } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { ACADEMIC_SESSION } from "@/features/admissions/constants";
import { formatDate, formatTaka } from "@/features/admissions/utils";

type Props = {
  name: string;
  classLabel: string;
  classesToday: number;
  attendanceRate: number;
  gpa: string;
  feesDue: number;
  off: string | null;
  today: string;
};

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/** Dashboard hero: greeting, class and four quick numbers. */
export function StudentWelcome({ name, classLabel, classesToday, attendanceRate, gpa, feesDue, off, today }: Props) {
  const highlights = [
    { label: "Classes today", value: classesToday, icon: BookOpen },
    { label: "Attendance", value: `${attendanceRate}%`, icon: CalendarCheck },
    { label: "Latest GPA", value: gpa, icon: Trophy },
    { label: "Fees due", value: formatTaka(feesDue), icon: Wallet },
  ];

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-navy-950 px-6 py-8 text-white shadow-card ring-1 ring-transparent sm:px-10 sm:py-10 dark:ring-white/10">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-white [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_65%)]" />
      <div aria-hidden className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />

      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100 ring-1 ring-inset ring-white/15">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            {classLabel} · {ACADEMIC_SESSION} · {formatDate(today)}
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-[32px] sm:leading-tight">
            {greeting()}, {name.split(" ")[0]} 👋
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
            {off ? (
              <>
                No school today — <span className="font-semibold text-white">{off}</span>.
              </>
            ) : (
              <>
                You have <span className="font-semibold text-white">{classesToday} class{classesToday === 1 ? "" : "es"}</span> today.
              </>
            )}
            {feesDue > 0 && (
              <>
                {" "}Tuition of <span className="font-semibold text-amber-300">{formatTaka(feesDue)}</span> is due — remind your guardian.
              </>
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/routine" className={buttonStyles({ variant: "white" })}>
              <CalendarClock className="h-4 w-4" />
              My Routine
            </Link>
            <Link href="/results" className={buttonStyles({ variant: "glass" })}>
              <Trophy className="h-4 w-4" />
              Results
            </Link>
            <Link href="/fees" className={buttonStyles({ variant: "glass" })}>
              <Wallet className="h-4 w-4" />
              Fees
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:w-[420px]">
          {highlights.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10 backdrop-blur-sm transition hover:bg-white/[0.09]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sky-200">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xl font-bold tabular-nums tracking-tight">{value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
