import type { Metadata } from "next";

import { ReportCardPrint } from "@/features/results/components/print/ReportCardPrint";

export const metadata: Metadata = { title: "Report Card" };

export const instant = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ReportCardPrint slug={slug} />;
}
