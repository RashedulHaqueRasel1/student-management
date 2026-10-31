import type { Metadata } from "next";

import { AdmitCardsPrint } from "@/features/examinations/components/print/AdmitCardsPrint";

export const metadata: Metadata = { title: "Admit Card" };

export const instant = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdmitCardsPrint slug={slug} />;
}
