import { CalendarCheck, CheckCircle2, ShieldCheck, Trophy, Wallet } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Sparkline } from "@/components/shared/Sparkline";

const features = [
  "Today's classes, teachers and exam routine",
  "Results, report cards and your attendance",
  "Tuition fees, leave requests and school notices",
];

const previewStats = [
  { label: "Attendance", value: "96.4%", icon: CalendarCheck, color: "text-emerald-300" },
  { label: "Latest GPA", value: "4.83", icon: Trophy, color: "text-amber-300" },
  { label: "Fees due", value: "৳ 0", icon: Wallet, color: "text-indigo-300" },
];

/** Left brand panel of the login screen (hidden on small screens). */
export function AuthShowcase() {
  return (
    <div className="relative isolate hidden flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:w-1/2 xl:w-[55%] xl:p-16">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-white [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div aria-hidden className="absolute -left-32 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-indigo-600/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -right-20 -z-10 h-[26rem] w-[26rem] rounded-full bg-violet-600/25 blur-3xl" />

      <Logo tone="dark" subtitle="Student Portal" />

      <div className="max-w-xl">
        <h2 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-[44px]">
          Your school day,{" "}
          <span className="bg-linear-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            all in one place.
          </span>
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-slate-300">
          Check your routine, follow your results and keep up with every notice
          from school — on any device.
        </p>

        {/* Product preview card */}
        <div className="mt-10 rounded-2xl bg-white/[0.05] p-5 ring-1 ring-inset ring-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">My progress</p>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
              Improving
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {previewStats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl bg-white/[0.05] p-3 ring-1 ring-inset ring-white/5">
                <Icon className={`h-4 w-4 ${color}`} />
                <p className="mt-2 text-lg font-bold tabular-nums">{value}</p>
                <p className="text-[11px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <Sparkline
            data={[3.9, 4.1, 4.0, 4.3, 4.25, 4.5, 4.4, 4.62, 4.7, 4.83]}
            labels={["Class test 1", "Class test 2", "First term", "Class test 3", "Class test 4", "Half yearly", "Class test 5", "Class test 6", "Second term", "Model test"]}
            seriesLabel="GPA"
            decimals={2}
            color="#a5b4fc"
            id="auth-spark"
            className="mt-4 h-16 w-full"
          />
        </div>

        <ul className="mt-8 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>© 2026 EduManage. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          256-bit encrypted
        </p>
      </div>
    </div>
  );
}
