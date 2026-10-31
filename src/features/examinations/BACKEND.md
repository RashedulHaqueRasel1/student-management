# Exams — backend contract

- `GET /me/exams` → exams that include the student's class: status, days, papers for the class, full / pass marks, instructions.
- `GET /me/exams/:id` → `{ room, seat, admitCard: { eligible, monthsDue, due } }`.
- `GET /me/exams/:id/admit-card` — printable admit card. **403 while two or more months of tuition are unpaid**
  (`WITHHOLD_AFTER_MONTHS`) unless the office released it.
