import type { Metadata } from "next";

import { MyAttendanceView } from "@/features/attendance/components/MyAttendanceView";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return <MyAttendanceView />;
}
