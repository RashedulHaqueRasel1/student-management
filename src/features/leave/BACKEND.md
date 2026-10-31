# Leave requests — backend contract

Workflow: **student** → class teacher (recommend / reject) → office (final). The guardian gets an SMS at each step.

- `GET /me/leave-requests` → `LeaveRequest[]` with `stage`, `teacherDecision`, `adminDecision`.
- `POST /me/leave-requests` `{ type, from, to, reason }` (attachment optional later)
  - `from` ≥ today, `to` ≥ from, 1–15 school days (weekend plan + holidays excluded).
  - No overlap with another request that isn't rejected.
  - Creates `stage: "teacher"`, `submittedBy: "Student portal"`; notifies the class teacher.
- `DELETE /me/leave-requests/:id` — withdraw; only while `stage = "teacher"`.
