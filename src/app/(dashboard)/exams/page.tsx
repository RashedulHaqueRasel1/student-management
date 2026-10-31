import type { Metadata } from "next";

import { MyExamsView } from "@/features/examinations/components/MyExamsView";

export const metadata: Metadata = { title: "Exams" };

export default function ExamsPage() {
  return <MyExamsView />;
}
