import type { Metadata } from "next";

import { MyResultsView } from "@/features/results/components/MyResultsView";

export const metadata: Metadata = { title: "Results" };

export default function ResultsPage() {
  return <MyResultsView />;
}
