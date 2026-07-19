import { BlobServiceClient } from "@azure/storage-blob";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function getContainerClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName =
    process.env.AZURE_STORAGE_CONTAINER_NAME || "blog-images";

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured");
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  return blobServiceClient.getContainerClient(containerName);
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export function validateImageUpload({ size, type }) {
  if (!ALLOWED_IMAGE_TYPES.has(type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed";
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return "Image must be 4MB or smaller";
  }

  return null;
}

export async function uploadImageBlob({ buffer, contentType, folder, fileName }) {
  const containerClient = getContainerClient();
  const safeName = sanitizeFileName(fileName || "image");
  const blobName = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blockBlobClient.url;
}
