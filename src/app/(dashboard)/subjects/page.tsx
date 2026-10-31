import type { Metadata } from "next";

import { MySubjectsView } from "@/features/subjects/components/MySubjectsView";

export const metadata: Metadata = { title: "My Subjects" };

export default function SubjectsPage() {
  return <MySubjectsView />;
}
