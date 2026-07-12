# Firebase setup notes

- Authentication: email/password enabled for the app.
- Firestore collections used: users, products, orders, appointments, clients.
- For now, only client-side admin protection is enforced via user role in Firestore.
- For production hardening, add server-side rules and optional Firebase App Check.
- Storage is intentionally not used yet; the app is prepared to add it later when Blaze is enabled.
