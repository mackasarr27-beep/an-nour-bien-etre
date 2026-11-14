import "server-only";

export class CloudinaryConfigurationError extends Error {
  constructor() {
    super("Configuration Cloudinary serveur absente ou invalide.");
    this.name = "CloudinaryConfigurationError";
  }
}

export function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  // Prefer an explicit complete set; never combine credentials from different sources.
  if (cloudName && apiKey && apiSecret && /^[a-zA-Z0-9_-]+$/.test(cloudName)) {
    return { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret };
  }
  try {
    const url = new URL(process.env.CLOUDINARY_URL?.trim() || "");
    if (url.protocol !== "cloudinary:" || !url.username || !url.password || !/^[a-zA-Z0-9_-]+$/.test(url.hostname)) throw new Error();
    return { cloud_name: url.hostname, api_key: decodeURIComponent(url.username), api_secret: decodeURIComponent(url.password) };
  } catch {
    throw new CloudinaryConfigurationError();
  }
}

export function safeCloudinaryError(error: unknown) {
  const status = error && typeof error === "object" && "http_code" in error ? Number(error.http_code) : 0;
  if (status === 401 || status === 403) return { code: "CLOUDINARY_CREDENTIALS_REJECTED", error: "Cloudinary refuse les identifiants serveur. Contactez l’administrateur technique." };
  if (status === 413) return { code: "CLOUDINARY_FILE_TOO_LARGE", error: "Le fichier dépasse la limite autorisée par Cloudinary." };
  if (status === 420 || status === 429) return { code: "CLOUDINARY_QUOTA", error: "Limite Cloudinary atteinte. Vérifiez le quota du compte." };
  return { code: "CLOUDINARY_UPLOAD_FAILED", error: "Cloudinary n’a pas accepté le fichier. Vérifiez le format, la taille et la connexion, puis réessayez." };
}
