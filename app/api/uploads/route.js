import { NextResponse } from "next/server";
import { requireAuthor } from "@/lib/auth";
import { uploadImageBlob, validateImageUpload } from "@/lib/azure-blob";

const ALLOWED_FOLDERS = new Set(["covers", "posts"]);

export async function POST(request) {
  try {
    const auth = await requireAuthor();
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "posts";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    const validationError = validateImageUpload({
      size: file.size,
      type: file.type,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBlob({
      buffer,
      contentType: file.type,
      folder,
      fileName: file.name,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
