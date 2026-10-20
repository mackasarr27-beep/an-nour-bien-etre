import "server-only";
import { createPrivateKey } from "node:crypto";

const serverAppName = "an-nour-server";
const expectedProjectId = "an-nour-bien-etre-2026";

export type FirebaseAdminDiagnostic = {
  reason: string;
  variables: string[];
  field?: string;
  errorType?: string;
};

export class FirebaseAdminConfigurationError extends Error {
  constructor(readonly diagnostics: FirebaseAdminDiagnostic[]) {
    super("Les identifiants serveur Firebase sont absents, invalides ou ne correspondent pas au projet attendu.");
    this.name = "FirebaseAdminConfigurationError";
  }
}

export class FirebaseAdminInitializationError extends Error {
  constructor(readonly phase: string, readonly errorType: string) {
    super("Firebase Admin initialization failed.");
    this.name = "FirebaseAdminInitializationError";
  }
}

function getErrorType(error: unknown): string {
  return error instanceof Error ? error.name : "UnknownError";
}

function logDiagnostic(diagnostic: FirebaseAdminDiagnostic): void {
  console.error("Firebase Admin configuration diagnostic", diagnostic);
}

function initializationError(phase: string, error: unknown): FirebaseAdminInitializationError {
  return new FirebaseAdminInitializationError(phase, getErrorType(error));
}

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function isServiceAccount(value: unknown): value is ServiceAccount {
  if (!value || typeof value !== "object") return false;
  const account = value as Record<string, unknown>;
  return typeof account.project_id === "string"
    && typeof account.client_email === "string"
    && typeof account.private_key === "string"
    && Boolean(account.project_id.trim())
    && Boolean(account.client_email.trim())
    && Boolean(account.private_key.trim());
}

function normalizePrivateKey(privateKey: string): string {
  return privateKey.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
}

function validatePrivateKey(
  privateKey: string,
  variables: string[],
  field: string,
  diagnostics: FirebaseAdminDiagnostic[],
): boolean {
  try {
    createPrivateKey(normalizePrivateKey(privateKey));
    return true;
  } catch (error) {
    const diagnostic = {
      reason: "malformed_private_key",
      variables,
      field,
      errorType: getErrorType(error),
    };
    diagnostics.push(diagnostic);
    logDiagnostic(diagnostic);
    return false;
  }
}

async function getServerApp() {
  let appModule: typeof import("firebase-admin/app");
  try {
    appModule = await import("firebase-admin/app");
  } catch (error) {
    throw initializationError("firebase-admin/app import", error);
  }

  const { cert, getApps, initializeApp } = appModule;
  let existingApp;
  try {
    existingApp = getApps().find((app) => app.name === serverAppName);
  } catch (error) {
    throw initializationError("Firebase Admin app lookup", error);
  }
  if (existingApp) return existingApp;

  const serverProjectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const publicProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const projectId = serverProjectId || publicProjectId;
  const projectIdVariable = serverProjectId ? "FIREBASE_PROJECT_ID" : "NEXT_PUBLIC_FIREBASE_PROJECT_ID";
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const diagnostics: FirebaseAdminDiagnostic[] = [];

  if (serviceAccountJson) {
    let serviceAccount: unknown;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (error) {
      const diagnostic = {
        reason: "invalid_service_account_json",
        variables: ["FIREBASE_SERVICE_ACCOUNT_JSON"],
        errorType: getErrorType(error),
      };
      diagnostics.push(diagnostic);
      logDiagnostic(diagnostic);
    }

    if (!isServiceAccount(serviceAccount)) {
      const diagnostic = {
        reason: "invalid_service_account_fields",
        variables: ["FIREBASE_SERVICE_ACCOUNT_JSON"],
        field: "project_id, client_email, private_key",
      };
      diagnostics.push(diagnostic);
      logDiagnostic(diagnostic);
    } else {
      const accountProjectId = serviceAccount.project_id.trim();
      if (accountProjectId !== expectedProjectId || (projectId && projectId !== accountProjectId)) {
        const diagnostic = {
          reason: "project_id_mismatch",
          variables: ["FIREBASE_SERVICE_ACCOUNT_JSON", projectIdVariable],
          field: "project_id",
        };
        diagnostics.push(diagnostic);
        logDiagnostic(diagnostic);
      } else if (validatePrivateKey(
        serviceAccount.private_key,
        ["FIREBASE_SERVICE_ACCOUNT_JSON"],
        "private_key",
        diagnostics,
      )) {
        try {
          const credential = cert({
            projectId: accountProjectId,
            clientEmail: serviceAccount.client_email.trim(),
            privateKey: normalizePrivateKey(serviceAccount.private_key),
          });
          try {
            return initializeApp({ credential, projectId: accountProjectId }, serverAppName);
          } catch (error) {
            throw initializationError("Firebase Admin initializeApp", error);
          }
        } catch (error) {
          if (error instanceof FirebaseAdminInitializationError) throw error;
          const diagnostic = {
            reason: "invalid_service_account_credentials",
            variables: ["FIREBASE_SERVICE_ACCOUNT_JSON"],
            errorType: getErrorType(error),
          };
          diagnostics.push(diagnostic);
          logDiagnostic(diagnostic);
        }
      }
    }
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const missingVariables = [
    !clientEmail ? "FIREBASE_CLIENT_EMAIL" : undefined,
    !privateKey ? "FIREBASE_PRIVATE_KEY" : undefined,
    !projectId ? "FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID" : undefined,
  ].filter((name): name is string => Boolean(name));

  if (projectId && projectId !== expectedProjectId) {
    const diagnostic = {
      reason: "project_id_mismatch",
      variables: [projectIdVariable],
      field: "project_id",
    };
    diagnostics.push(diagnostic);
    logDiagnostic(diagnostic);
  } else if (missingVariables.length) {
    const diagnostic = {
      reason: "missing_server_credentials",
      variables: missingVariables,
    };
    diagnostics.push(diagnostic);
    logDiagnostic(diagnostic);
  } else if (projectId && clientEmail && privateKey && validatePrivateKey(
    privateKey,
    ["FIREBASE_PRIVATE_KEY"],
    "private_key",
    diagnostics,
  )) {
    try {
      const credential = cert({
        projectId,
        clientEmail,
        privateKey: normalizePrivateKey(privateKey),
      });
      try {
        return initializeApp({ credential, projectId }, serverAppName);
      } catch (error) {
        throw initializationError("Firebase Admin initializeApp", error);
      }
    } catch (error) {
      if (error instanceof FirebaseAdminInitializationError) throw error;
      const diagnostic = {
        reason: "invalid_service_account_credentials",
        variables: ["FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY", projectIdVariable],
        errorType: getErrorType(error),
      };
      diagnostics.push(diagnostic);
      logDiagnostic(diagnostic);
    }
  }

  if (!diagnostics.length) {
    const diagnostic = {
      reason: "missing_server_credentials",
      variables: ["FIREBASE_SERVICE_ACCOUNT_JSON", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"],
    };
    diagnostics.push(diagnostic);
    logDiagnostic(diagnostic);
  }

  throw new FirebaseAdminConfigurationError(diagnostics);
}

export async function getFirebaseAdminAuth() {
  let authModule: typeof import("firebase-admin/auth");
  try {
    authModule = await import("firebase-admin/auth");
  } catch (error) {
    throw initializationError("firebase-admin/auth import", error);
  }

  const app = await getServerApp();
  try {
    return authModule.getAuth(app);
  } catch (error) {
    throw initializationError("Firebase Admin getAuth", error);
  }
}
