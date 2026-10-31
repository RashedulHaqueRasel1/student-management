import Link from "next/link";
import { ArrowRight, CheckCircle2, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTaka } from "@/features/admissions/utils";
import type { TuitionLedger } from "@/features/students/types/types";

/** Tuition at a glance: what's due and the next payment date. */
export function FeesCard({ ledger }: { ledger: TuitionLedger }) {
  const paidPct = ledger.sessionTotal ? Math.round((ledger.paidTotal / ledger.sessionTotal) * 100) : 0;
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Tuition fees</CardTitle>
          <CardDescription>{formatTaka(ledger.baseFee)} per month</CardDescription>
        </div>
        <Link href="/fees" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          Details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <div className="p-6 pt-4">
        {ledger.outstanding > 0 ? (
          <div className="rounded-2xl bg-amber-50 p-4 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Wallet className="h-4 w-4" />
              {formatTaka(ledger.outstanding)} due now
            </p>
            <p className="mt-1 text-xs opacity-80">Your guardian can pay at the school office or by bKash / Nagad.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              All fees paid
            </p>
            <p className="mt-1 text-xs opacity-80">Nothing is due right now.</p>
          </div>
        )}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-fg-muted">
            <span>Paid this session</span>
            <span className="font-semibold tabular-nums text-fg">{paidPct}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${paidPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-fg-subtle">
            {formatTaka(ledger.paidTotal)} of {formatTaka(ledger.sessionTotal)}
          </p>
        </div>
        {ledger.nextDue && (
          <p className="mt-4 flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm">
            <span className="text-fg-muted">Next due</span>
            <span className="font-medium text-fg">
              {ledger.nextDue.label} · {formatDate(ledger.nextDue.dueDate)} <Badge tone="warning">{formatTaka(ledger.nextDue.due)}</Badge>
            </span>
          </p>
        )}
      </div>
    </Card>
  );
}
