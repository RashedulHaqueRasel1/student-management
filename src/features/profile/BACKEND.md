# Profile — backend contract

- `GET /me` → student, profile (religion, nationality, addresses, medical notes), guardians, account, recent audit entries. Read-only for students — guardians ask the office for changes.
- `POST /me/password` `{ currentPassword, newPassword }` — min 8 chars, letters + numbers. Sets `passwordChangedAt`, clears `mustChangePassword`.
