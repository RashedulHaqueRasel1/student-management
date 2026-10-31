"use client";

import { CalendarClock, CircleDollarSign, Printer, TrendingDown, Wallet } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChartTooltip, useTooltip } from "@/components/ui/tooltip";
import { PAYMENT_METHODS, SCHOOL_INFO } from "@/features/admissions/constants";
import { formatDate, formatTaka } from "@/features/admissions/utils";
import { useCurrentStudent } from "@/features/auth/hooks/use-current-student";
import type { TuitionMonthStatus } from "@/features/students/types/types";
import { cn } from "@/lib/utils";

const STATUS: Record<TuitionMonthStatus, { label: string; tone: BadgeTone; tile: string; dot: string }> = {
  paid: { label: "Paid", tone: "success", tile: "bg-emerald-500 text-white", dot: "bg-emerald-500" },
  partial: { label: "Part paid", tone: "warning", tile: "bg-amber-400 text-amber-950", dot: "bg-amber-400" },
  due: { label: "Due", tone: "warning", tile: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200", dot: "bg-amber-300" },
  overdue: { label: "Overdue", tone: "danger", tile: "bg-rose-500 text-white", dot: "bg-rose-500" },
  upcoming: { label: "Upcoming", tone: "neutral", tile: "bg-soft text-fg-muted", dot: "bg-slate-400" },
  waived: { label: "Waived", tone: "info", tile: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200", dot: "bg-sky-400" },
};

export const tuitionReceiptHref = (receiptNo: string) => `/receipts/tuition/${encodeURIComponent(receiptNo)}`;

/**
 * Tuition ledger for the session, payment history and receipts (read-only —
 * guardians pay at the office or by mobile banking).
 * TODO (backend phase): GET /me/tuition
 */
export function MyFeesView() {
  const { student, tuition, hydrated } = useCurrentStudent();
  const tip = useTooltip();
  if (!hydrated || !student || !tuition) return <div className="h-[480px] animate-pulse rounded-2xl bg-soft" aria-busy="true" />;

  const tiles = [
    { label: "Monthly fee", value: formatTaka(tuition.months[0]?.fee ?? tuition.baseFee), icon: Wallet, accent: "bg-indigo-50 text-indigo-600" },
    { label: "Paid this session", value: formatTaka(tuition.paidTotal), icon: CircleDollarSign, accent: "bg-emerald-50 text-emerald-600" },
    { label: "Due now", value: formatTaka(tuition.outstanding), icon: TrendingDown, accent: tuition.outstanding > 0 ? "bg-amber-50 text-amber-600" : "bg-sky-50 text-sky-600" },
    { label: "Next due", value: tuition.nextDue ? formatDate(tuition.nextDue.dueDate) : "—", icon: CalendarClock, accent: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Fees & Payments" description={`Tuition is due by the 10th of each month. Your guardian can pay at the school office, by bKash / Nagad or bank. Questions? Call ${SCHOOL_INFO.phone}.`} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {tiles.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", accent)}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg-muted">{label}</p>
              <p className="truncate text-xl font-bold tabular-nums tracking-tight text-fg sm:text-2xl">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      {tuition.settings.discountPercent > 0 && (
        <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:bg-sky-500/10 dark:text-sky-200">
          You get a <span className="font-semibold">{tuition.settings.discountPercent}% discount</span>
          {tuition.settings.discountReason && ` (${tuition.settings.discountReason})`} — the fees below already include it.
        </p>
      )}

      <Card className="p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold tracking-tight text-fg">Month by month</h2>
        <p className="mt-0.5 text-xs text-fg-muted">Hover a month to see what was paid and when.</p>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-12">
          {tuition.months.map((m) => {
            const st = STATUS[m.status];
            const paidPct = m.fee ? Math.round((m.paid / m.fee) * 100) : 0;
            return (
              <div
                key={m.month}
                tabIndex={0}
                {...tip.trigger(
                  <ChartTooltip
                    title={m.label}
                    subtitle={`${st.label} · due ${formatDate(m.dueDate)}`}
                    rows={[
                      { label: "Fee", value: formatTaka(m.fee) },
                      { label: "Paid", value: formatTaka(m.paid), color: "bg-emerald-500" },
                      { label: "Due", value: formatTaka(m.due), color: m.due > 0 ? "bg-rose-500" : "bg-slate-500", muted: m.due === 0 },
                    ]}
                    footer={m.payments.length ? `Receipt ${m.payments.map((p) => p.receiptNo).join(", ")}` : undefined}
                  />,
                )}
                className={cn(
                  "flex cursor-default flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                  st.tile,
                )}
              >
                <span className="text-sm font-bold">{m.label.slice(0, 3)}</span>
                <span className="text-[10px] font-semibold opacity-80">{m.status === "partial" ? `${paidPct}%` : st.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-fg-muted">
          {Object.values(STATUS).map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", s.dot)} />
              {s.label}
            </span>
          ))}
        </div>
        {tip.node}
      </Card>

      <Card className="overflow-hidden">
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <h2 className="text-[15px] font-semibold tracking-tight text-fg">Payments</h2>
          <p className="mt-0.5 text-xs text-fg-muted">Open a slip to print or save it as PDF.</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-y border-line bg-subtle/70 text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                <th className="py-3 pl-5 pr-3 sm:pl-6">Date</th>
                <th className="px-3 py-3">Receipt</th>
                <th className="px-3 py-3">Months</th>
                <th className="px-3 py-3">Method</th>
                <th className="px-3 py-3 text-right">Amount</th>
                <th className="py-3 pl-3 pr-5 text-right sm:pr-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tuition.payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pl-5 pr-3 font-medium text-fg sm:pl-6">{formatDate(p.paidOn)}</td>
                  <td className="px-3 py-3 font-mono text-xs text-fg-secondary">{p.receiptNo}</td>
                  <td className="px-3 py-3 text-fg-secondary">{p.allocations.map((a) => new Date(`${a.month}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })).join(", ")}</td>
                  <td className="px-3 py-3">
                    <Badge>{PAYMENT_METHODS[p.method].label}</Badge>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums text-fg">{formatTaka(p.total)}</td>
                  <td className="py-3 pl-3 pr-5 text-right sm:pr-6">
                    <a href={tuitionReceiptHref(p.receiptNo)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                      <Printer className="h-3.5 w-3.5" />
                      Slip
                    </a>
                  </td>
                </tr>
              ))}
              {tuition.payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-fg-muted">
                    No payments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
