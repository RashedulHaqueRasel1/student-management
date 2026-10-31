import type { Metadata } from "next";

import { MyFeesView } from "@/features/fees/components/MyFeesView";

export const metadata: Metadata = { title: "Fees & Payments" };

export default function FeesPage() {
  return <MyFeesView />;
}
