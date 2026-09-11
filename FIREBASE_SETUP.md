# Firebase setup notes

- Authentication: email/password enabled for the app.
- Firestore collections used: users, products, orders, appointments, clients.
- For now, only client-side admin protection is enforced via user role in Firestore.
- For production hardening, add server-side rules and optional Firebase App Check.
- Storage is intentionally not used yet; the app is prepared to add it later when Blaze is enabled.

## Appointment emails through Vercel

Appointment emails use the Next.js Route Handler at `app/api/appointment-email/route.ts` and Resend. Firebase remains responsible for storing appointments; no Firebase Functions or Firebase Secret Manager is required.

Configure these variables in the Vercel project settings for the relevant environments:

```text
RESEND_API_KEY=<server-only Resend key>
ADMIN_EMAIL=cstvsenegal@gmail.com
RESEND_FROM_EMAIL=<sender address verified in Resend>
```

Never prefix `RESEND_API_KEY` with `NEXT_PUBLIC_` and never commit its value. `RESEND_FROM_EMAIL` (or the legacy `FROM_EMAIL`) must be a Resend-verified sender; the project does not invent or assume a custom domain.

The appointment form writes the existing `appointments` document with `status: "pending"`, then calls the server route to notify `ADMIN_EMAIL`. When the admin changes the status to `Confirmé`, the admin UI calls the same server route to notify the client's stored `email`.

The legacy `functions/` scaffold remains in the repository for traceability, but it is not part of this Vercel email path and must not be deployed for this architecture.
