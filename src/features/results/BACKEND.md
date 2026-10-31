# Results — backend contract (read-only)

- `GET /me/results` → `ExamResult[]` — **published exams only** (subject marks, highest in class, grade, GPA, position, remarks).
  Exams not yet published come back as `{ id, name, status: "upcoming" }` without marks.
- `GET /me/results/:examId/report-card` — printable report card; 404 until published.
