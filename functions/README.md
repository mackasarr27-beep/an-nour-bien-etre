# Legacy appointment email scaffold

This folder is retained for traceability only. The active appointment email implementation is the Next.js Route Handler at `app/api/appointment-email/route.ts`, using Vercel Environment Variables and Resend. It is not referenced by `firebase.json`; do not deploy this folder or configure Firebase Secret Manager for the current architecture.

These Firebase Functions use the existing `appointments` collection.

## Required configuration

Configure the Resend API key as a Firebase Secret Manager secret. Do not put it in the Next.js frontend or in any `NEXT_PUBLIC_*` variable:

```powershell
firebase functions:secrets:set RESEND_API_KEY --project an-nour-bien-etre-2026
```

At the first deployment, Firebase prompts for these parameter values:

- `ADMIN_EMAIL`: the real cabinet administrator email address.
- `FROM_EMAIL`: a sender address verified in Resend. Do not invent a domain; use a Resend-approved sender.

The functions are:

- `notifyAdminOfNewAppointment`: sends the pending request notification after an appointment is created with `status: "pending"`.
- `notifyClientOfConfirmedAppointment`: sends the client confirmation when status changes to `Confirmé` or `confirmed`.

Technical marker fields are written to the same appointment document to prevent duplicate sends:

- `notificationSentAt`
- `confirmationSentAt`

## Install and build

```powershell
npm install --prefix functions
npm run build --prefix functions
```

## Deploy only Functions

```powershell
firebase deploy --only functions --project an-nour-bien-etre-2026
```

Do not run this command until Resend has verified the sender address and the secret/parameters are configured.
