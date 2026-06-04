import { createClient } from "@supabase/supabase-js";

const DEFAULT_BUCKET = "gallery";

function normalizeSupabaseUrl(value: string) {
  return value.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

function normalizeBucketName(value?: string) {
  return (value || DEFAULT_BUCKET).trim().replace(/^\/+|\/+$/g, "");
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
    : "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = normalizeBucketName(process.env.SUPABASE_STORAGE_BUCKET);

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL tidak valid. Gunakan Project URL Supabase, contoh: https://namaproject.supabase.co"
    );
  }

  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(bucket)) {
    throw new Error(
      "SUPABASE_STORAGE_BUCKET tidak valid. Gunakan nama bucket tanpa spasi atau slash."
    );
  }

  return {
    url,
    serviceRoleKey,
    bucket,
  };
}

function createSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getFileExtension(fileName: string) {
  const cleaned = fileName.trim().toLowerCase();
  const dotIndex = cleaned.lastIndexOf(".");

  if (dotIndex === -1 || dotIndex === cleaned.length - 1) {
    return "bin";
  }

  return cleaned.slice(dotIndex + 1).replace(/[^a-z0-9]/g, "") || "bin";
}

export async function uploadGalleryImage(file: File, albumId: string) {
  return uploadStorageImage(file, `gallery-albums/${albumId}`);
}

export async function uploadNewsCover(file: File, newsId: string) {
  return uploadStorageImage(file, `news-covers/${newsId}`);
}

async function uploadStorageImage(file: File, directory: string) {
  const { bucket } = getSupabaseConfig();
  const client = createSupabaseAdminClient();
  const extension = getFileExtension(file.name);
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const storagePath = `${directory}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(bucket).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload gambar ke Supabase gagal: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = client.storage.from(bucket).getPublicUrl(storagePath);

  return {
    imageUrl: publicUrl,
    storagePath,
  };
}

export async function deleteGalleryImages(storagePaths: string[]) {
  await deleteStorageObjects(storagePaths);
}

export async function deleteStorageObjects(storagePaths: string[]) {
  if (storagePaths.length === 0) {
    return;
  }

  const { bucket } = getSupabaseConfig();
  const client = createSupabaseAdminClient();
  const { error } = await client.storage.from(bucket).remove(storagePaths);

  if (error) {
    throw new Error(`Gagal menghapus gambar Supabase: ${error.message}`);
  }
}

export function getStoragePathFromPublicUrl(publicUrl: string | null | undefined) {
  if (!publicUrl) {
    return null;
  }

  const normalizedUrl = publicUrl.trim();
  if (!normalizedUrl) {
    return null;
  }

  const { url, bucket } = getSupabaseConfig();
  const publicBase = `${url}/storage/v1/object/public/${bucket}/`;

  if (!normalizedUrl.startsWith(publicBase)) {
    return null;
  }

  const storagePath = normalizedUrl.slice(publicBase.length);
  return storagePath || null;
}
