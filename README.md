# EduManage — Student Portal

The student-facing side of EduManage. A student signs in with their student ID and sees their own school life: today's classes, routine, subjects and teachers, attendance, exams and admit cards, results and report cards, tuition fees, leave requests and school notices.

Same stack and folder structure as the admin app (`../School-Management`) and the teacher portal (`../teacher-management`).

> **Project status:** a frontend prototype on the same deterministic demo data as the other two apps. Student actions (leave requests, password change) are saved in the browser with `localStorage`. Each app runs on its own port, so they **don't share** browser data until a backend is connected.

## Pages

| Route | What the student can do |
| --- | --- |
| `/login` | Sign in with a student ID (demo: pick any student, any password) |
| `/dashboard` | Greeting, today's classes (live "now / next"), gate check-in, latest result, fees, notices, events |
| `/routine` | Weekly class routine with teachers (printable) |
| `/subjects` | Subjects, subject teachers, class teacher contact, latest grade per subject |
| `/attendance` | Gate-scanner attendance: yearly summary, calendar, month-by-month chart, daily log |
| `/exams` | Exam routine for their class, seat, admit card (withheld while 2+ months of fees are unpaid) |
| `/results` | GPA across exams, subject marks vs. class highest, remarks, report card |
| `/fees` | Monthly tuition status, payments and printable slips |
| `/leave` | Ask for leave, follow class teacher → office approval, withdraw while pending |
| `/notices` · `/events` | Notices and calendar for students of their class |
| `/profile` | Own record, guardians, change password |

Print pages (own records only): `/admit-cards/[exam]`, `/report-cards/[exam]`, `/receipts/tuition/[receiptNo]`, `/notice-print/[slug]`.

Charts show a tooltip on hover / keyboard focus (`components/ui/tooltip.tsx`).

## Getting started

```bash
cd student-management
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) (admin: 3000, teacher portal: 3001) and pick a student in the demo box on the login page.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3003. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production build on port 3003. |
| `npm run lint` | Run ESLint. |

## Project structure

```text
src/
├── app/
│   ├── (auth)/          # /login
│   ├── (dashboard)/     # every student page (sidebar + header shell, sign-in guard)
│   └── (print)/         # admit card, report card, tuition slip, notice
├── components/          # Shared UI kit (incl. tooltip) and the dashboard shell
├── features/
│   ├── auth/            # session store, useCurrentStudent, login form
│   ├── dashboard/       # home page widgets
│   ├── routine/         # useMyRoutine, weekly timetable
│   ├── subjects/        # my subjects & teachers
│   ├── attendance/      # my attendance
│   ├── examinations/    # my exams + admit card
│   ├── results/         # my results + report card
│   ├── fees/            # tuition ledger & slips
│   ├── leave/           # leave requests
│   ├── profile/         # my profile & password
│   ├── notices/ events/ # read-only notices and calendar
│   └── admissions/ students/ teachers/ classes/  # shared demo data, types and stores
├── hooks/  lib/  Providers/  store/  types/
```

Each module has a `BACKEND.md` with the API it needs. Every `/me/*` endpoint must be scoped to the signed-in student on the server.

## Production checklist

- Real authentication (NextAuth) with role `student`; enforce it in `proxy.ts`.
- Connect to the same API as the admin and teacher apps.
- Server-side checks: own records only, admit card withholding, staff-only notices hidden.
- Guardian SMS on leave decisions; monitoring and automated tests.
