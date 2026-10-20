import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "../../../lib/admin-api-auth";

export const runtime = "nodejs";

const maxUploadBytes = 100 * 1024 * 1024;
const maxRequestBytes = 105 * 1024 * 1024;
const maxImageBytes = 15 * 1024 * 1024;
const maxVideoBytes = 100 * 1024 * 1024;
const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const videoMimeTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const uploadFolders = new Set(["products", "gallery", "blog"]);

type CloudinaryUploadResult = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  error?: { message?: string };
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function validCloudinaryUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

async function uploadWithSdk(file: File, folder: string, resourceType: "image" | "video") {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  const hasCloudinaryUrl = cloudinaryUrl?.startsWith("cloudinary://") ?? false;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const { v2: cloudinary } = await import("cloudinary");
  if (hasCloudinaryUrl && cloudinaryUrl) {
    cloudinary.config({ cloudinary_url: cloudinaryUrl });
  } else {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result ?? {});
      },
    );
    uploadStream.end(buffer);
  });
}

async function uploadWithPreset(
  file: File,
  folder: string,
  resourceType: "image" | "video",
  cloudName: string,
  uploadPreset: string,
) {
  const presetForm = new FormData();
  presetForm.append("file", file, file.name);
  presetForm.append("folder", folder);
  presetForm.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: presetForm,
  });

  let payload: CloudinaryUploadResult;
  try {
    payload = (await response.json()) as CloudinaryUploadResult;
  } catch {
    throw new Error(`Cloudinary a renvoyé une réponse invalide (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(payload.error?.message || `Cloudinary a refusé le fichier (HTTP ${response.status}).`);
  }

  return payload;
}

export async function POST(request: Request) {
  const authorization = await authorizeAdminRequest(request);
  if (!authorization.authorized) {
    return NextResponse.json({ error: authorization.message }, { status: authorization.status });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxRequestBytes) {
    return NextResponse.json({ error: "Le téléversement ne peut pas dépasser 100 Mo." }, { status: 413 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    const requestedFolder = formData.get("folder");
    const folder = typeof requestedFolder === "string" && uploadFolders.has(requestedFolder)
      ? requestedFolder
      : "products";

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ error: "Vous pouvez téléverser au maximum 10 fichiers à la fois." }, { status: 400 });
    }

    let totalBytes = 0;
    for (const file of files) {
      const isImage = imageMimeTypes.has(file.type);
      const isVideo = videoMimeTypes.has(file.type);
      if (!isImage && !isVideo) {
        return NextResponse.json({ error: `Le format du fichier « ${file.name} » n’est pas accepté.` }, { status: 400 });
      }

      const maxFileBytes = isImage ? maxImageBytes : maxVideoBytes;
      if (!file.size || file.size > maxFileBytes) {
        const limit = isImage ? "15 Mo" : "100 Mo";
        return NextResponse.json({ error: `Le fichier « ${file.name} » doit faire moins de ${limit}.` }, { status: 413 });
      }
      totalBytes += file.size;
    }

    if (totalBytes > maxUploadBytes) {
      return NextResponse.json({ error: "Les fichiers téléversés ne peuvent pas dépasser 100 Mo au total." }, { status: 413 });
    }

    const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
    const hasCloudinaryUrl = cloudinaryUrl?.startsWith("cloudinary://") ?? false;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const useSdk = hasCloudinaryUrl || Boolean(cloudName && apiKey && apiSecret);
    const usePreset = !useSdk && Boolean(cloudName && uploadPreset);

    if (!useSdk && !usePreset) {
      return NextResponse.json(
        { error: "Configuration Cloudinary incomplète : définissez CLOUDINARY_URL, ou CLOUDINARY_CLOUD_NAME avec les identifiants serveur ou un preset d’importation." },
        { status: 501 },
      );
    }

    if (usePreset && (!cloudName || !/^[a-zA-Z0-9_-]+$/.test(cloudName))) {
      return NextResponse.json({ error: "Le nom du compte Cloudinary est invalide." }, { status: 500 });
    }

    const assets: Array<{
      url: string;
      type: "image" | "video";
      resourceType: "image" | "video";
      publicId?: string;
      format?: string;
      bytes?: number;
      width?: number;
      height?: number;
      duration?: number;
    }> = [];

    for (const file of files) {
      const resourceType = videoMimeTypes.has(file.type) ? "video" : "image";
      let uploaded: CloudinaryUploadResult;

      try {
        uploaded = useSdk
          ? await uploadWithSdk(file, folder, resourceType)
          : await uploadWithPreset(file, folder, resourceType, cloudName!, uploadPreset!);
      } catch (error) {
        const message = getErrorMessage(error, "Cloudinary a refusé le téléversement.");
        console.error("Cloudinary upload failed", { message, resourceType, folder });
        return NextResponse.json({ error: `Échec du téléversement Cloudinary : ${message}` }, { status: 502 });
      }

      if (!validCloudinaryUrl(uploaded.secure_url)) {
        console.error("Cloudinary returned an invalid secure URL", { fileName: file.name });
        return NextResponse.json(
          { error: "Cloudinary n’a pas renvoyé d’URL HTTPS valide." },
          { status: 502 },
        );
      }

      assets.push({
        url: uploaded.secure_url,
        type: resourceType,
        resourceType,
        publicId: uploaded.public_id,
        format: uploaded.format,
        bytes: uploaded.bytes,
        width: uploaded.width,
        height: uploaded.height,
        duration: uploaded.duration,
      });
    }

    return NextResponse.json({ urls: assets.map((asset) => asset.url), assets });
  } catch (error) {
    const message = getErrorMessage(error, "Erreur inattendue pendant le téléversement.");
    console.error("Cloudinary route error", { message });
    return NextResponse.json(
      { error: `Une erreur est survenue pendant le téléversement Cloudinary : ${message}` },
      { status: 500 },
    );
  }
}
