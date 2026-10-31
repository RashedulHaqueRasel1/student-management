# Routine & subjects — backend contract (read-only)

- `GET /me/routine` → `[{ day 0–6, period 1–6, subject, teacherName }]` for the student's section,
  with the shared religion period resolved to the student's own religion subject and teacher.
  Weekly off days (the student's weekend plan) are left out.
- `GET /me/subjects` → `SubjectInfo[]` (code, name, teacher, periods / week) + the class teacher's contact.
- Period times: section shift start + (period − 1) × 45 min.
