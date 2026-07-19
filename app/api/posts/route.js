import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  listPosts,
  listAllPosts,
  createPost,
  slugify,
  toListItem,
  getPostBySlug,
} from "@/lib/posts";
import { requireAuthor, canEditPosts } from "@/lib/auth";
import { auth0 } from "@/lib/auth0";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await getPostBySlug(slug);
      if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    if (status && status !== "published") {
      const session = await auth0.getSession();
      if (!session?.user || !canEditPosts(session.user)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (status === "all") {
        const posts = await listAllPosts();
        return NextResponse.json(posts.map(toListItem));
      }

      const posts = await listPosts({ status });
      return NextResponse.json(posts.map(toListItem));
    }

    const posts = await listPosts({ status: "published" });
    return NextResponse.json(posts.map(toListItem));
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAuthor();
    if (auth.error) return auth.error;

    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = body.slug?.trim() || slugify(body.title);
    const existing = await getPostBySlug(slug, { includeDrafts: true });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const post = await createPost({
      title: body.title.trim(),
      description: body.description?.trim() || "",
      slug,
      coverImageUrl: body.coverImageUrl || "",
      content: body.content || [],
      status: body.status === "draft" ? "draft" : "published",
      authorId: auth.user.sub,
      authorName: auth.user.name || auth.user.email || "",
    });

    revalidatePath("/blog");
    if (post.slug) revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
