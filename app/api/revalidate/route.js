import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function isAllowedPath(path) {
  if (path === "/blog") return true;
  if (!path.startsWith("/blog/")) return false;
  const slug = path.slice("/blog/".length);
  return slug.length > 0 && !slug.includes("/");
}

export async function POST(request) {
  try {
    const { path } = await request.json();

    if (!path || typeof path !== "string" || !isAllowedPath(path)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    console.error("Error revalidating path:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
