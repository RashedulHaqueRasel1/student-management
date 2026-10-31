# Attendance — backend contract (read-only)

- `GET /me/attendance?from=&to=` → `AttendanceDay[]` from the gate scanner with corrections
  (class teacher / office) and approved leave applied. Corrections are flagged `edited`.
- Students can't change attendance. A wrong record is reported to the class teacher.
