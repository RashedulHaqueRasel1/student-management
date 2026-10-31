# Notices & events — backend contract (read-only)

- `GET /me/notices` → published notices sent to **students or parents** of the student's class (or every class), pinned first. Staff-only notices are never returned.
- `GET /me/notices/:slug` → one notice; 404 for drafts, scheduled, expired, archived, staff-only or other classes' notices.
- `GET /me/calendar?from=&to=` → holidays plus events and exams for students of the student's class.
