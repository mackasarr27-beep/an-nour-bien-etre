import { ADMIN_EMAILS } from "./admin-emails";
import {
  FirebaseAdminConfigurationError,
  FirebaseAdminInitializationError,
  getFirebaseAdminAuth,
} from "./firebase-admin";

type AdminAuthorization =
  | { authorized: true; uid: string }
  | { authorized: false; status: 401 | 403 | 503; message: string };

export async function authorizeAdminRequest(request: Request): Promise<AdminAuthorization> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return { authorized: false, status: 401, message: "Connexion administrateur requise." };
  }

  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
    return { authorized: false, status: 401, message: "Votre session a expiré. Reconnectez-vous." };
  }

  let adminAuth;
  try {
    adminAuth = await getFirebaseAdminAuth();
  } catch (error) {
    if (error instanceof FirebaseAdminConfigurationError) {
      console.error("Firebase Admin configuration is invalid or incomplete", {
        errorType: error.name,
        diagnostics: error.diagnostics,
      });
      return { authorized: false, status: 503, message: "La configuration d’authentification serveur est invalide ou incomplète." };
    }

    console.error("Firebase Admin initialization failed", {
      phase: error instanceof FirebaseAdminInitializationError ? error.phase : "Firebase Admin initialization",
      message: "Firebase Admin failed to initialize; no credential values were logged.",
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorType: error instanceof FirebaseAdminInitializationError ? error.errorType : undefined,
    });
    return { authorized: false, status: 503, message: "Le service d’authentification est temporairement indisponible." };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    const email = decodedToken.email?.toLowerCase();

    if (!email || !ADMIN_EMAILS.includes(email)) {
      return { authorized: false, status: 403, message: "Accès réservé aux administrateurs autorisés." };
    }

    return { authorized: true, uid: decodedToken.uid };
  } catch (error) {
    console.warn("Firebase admin API token verification failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return { authorized: false, status: 401, message: "Votre session a expiré. Reconnectez-vous." };
  }
}
