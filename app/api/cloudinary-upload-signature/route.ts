import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "../../../lib/admin-api-auth";
import { getCloudinaryCredentials } from "../../../lib/cloudinary-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authorization = await authorizeAdminRequest(request);
  if (!authorization.authorized) return NextResponse.json({ error: authorization.message }, { status: authorization.status });
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ code: "INVALID_JSON", error: "Demande de signature invalide." }, { status: 400 });
  }
  const folder = body?.folder;
  if (!["products", "gallery", "blog", "banners"].includes(folder)) {
    return NextResponse.json({ code: "INVALID_FOLDER", error: "Dossier d’importation invalide." }, { status: 400 });
  }
  try {
    const credentials = getCloudinaryCredentials();
    const { v2: cloudinary } = await import("cloudinary");
    // Only server-controlled parameters are signed. No deletion or overwrite authorization.
    const params = { timestamp: Math.floor(Date.now() / 1000), folder, overwrite: false };
    const signature = cloudinary.utils.api_sign_request(params, credentials.api_secret);
    return NextResponse.json({ ...params, signature, apiKey: credentials.api_key, cloudName: credentials.cloud_name }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Cloudinary signature unavailable", { code: "CLOUDINARY_CONFIGURATION" });
    return NextResponse.json({ code: "CLOUDINARY_CONFIGURATION", error: "Configuration Cloudinary serveur absente ou invalide." }, { status: 503 });
  }
}
