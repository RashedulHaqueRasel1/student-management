# Auth (student portal) — backend contract

The demo keeps the signed-in student's ID in localStorage (`store/session.store.ts`,
key `student-session-demo`) and accepts any password for a current student's ID.

| Action | Endpoint | Notes |
| --- | --- | --- |
| Sign in | `POST /auth/student/login` `{ username, password }` | Username = student ID without dashes (`stu20250107`); the ID itself is accepted too. Reject students who have left (TC issued) or whose portal account is suspended / blocked / disabled. |
| Current student | `GET /me` | `Student` + `StudentAccount` (never the password). |
| Sign out | `POST /auth/logout` | |

- **Every `/me/*` endpoint is scoped to the token's student** — the client never sends a student ID.
- If `mustChangePassword` is true, open the change-password dialog after sign-in.
