import { createHash } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function createSignature(params: Record<string, string | number>, apiSecret: string) {
  const paramsString = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${paramsString}${apiSecret}`)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "La configuration Cloudinary n’est pas disponible sur le serveur." },
        { status: 501 },
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      const timestamp = Math.floor(Date.now() / 1000);
      const params = {
        folder: "products",
        timestamp,
      };

      const signature = createSignature(params, apiSecret);
      const uploadForm = new FormData();

      uploadForm.append("file", file, file.name);
      uploadForm.append("api_key", apiKey);
      uploadForm.append("timestamp", String(timestamp));
      uploadForm.append("signature", signature);
      uploadForm.append("folder", "products");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadForm,
      });

      const payload = (await response.json()) as { secure_url?: string; error?: { message?: string } };

      if (!response.ok || !payload.secure_url) {
        console.error("Cloudinary upload failed", payload);
        return NextResponse.json(
          {
            error: payload.error?.message || "Échec du téléchargement Cloudinary.",
          },
          { status: 500 },
        );
      }

      urls.push(payload.secure_url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Cloudinary route error", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue pendant le téléchargement Cloudinary." },
      { status: 500 },
    );
  }
}
