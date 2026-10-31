# Fees — backend contract (read-only)

- `GET /me/tuition` → `TuitionLedger` (monthly fee after discount, months with paid / partial / due / overdue / upcoming, payments, outstanding, next due).
- `GET /me/tuition/receipts/:receiptNo` — printable slip; 404 if it isn't the student's.
- Payments are recorded by the office (cash / bKash / Nagad / bank). Online payment can be added later as `POST /me/tuition/checkout`.
