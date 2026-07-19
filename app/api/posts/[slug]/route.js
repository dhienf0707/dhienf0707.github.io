import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  slugify,
} from "@/lib/posts";
import { requireAuthor, canManagePost, canDeletePost } from "@/lib/auth";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await requireAuthor();
    if (auth.error) return auth.error;

    const { slug: idOrSlug } = await params;
    let post = await getPostById(idOrSlug);
    if (!post) {
      post = await getPostBySlug(idOrSlug, { includeDrafts: true });
    }

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!canManagePost(auth.user, post)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const nextSlug =
      body.slug?.trim() ||
      (body.title ? slugify(body.title) : post.slug);

    if (nextSlug !== post.slug) {
      const conflict = await getPostBySlug(nextSlug, { includeDrafts: true });
      if (conflict && conflict.id !== post.id) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await updatePost(post.id, {
      title: body.title?.trim() ?? post.title,
      description: body.description?.trim() ?? post.description,
      slug: nextSlug,
      coverImageUrl:
        body.coverImageUrl !== undefined
          ? body.coverImageUrl
          : post.coverImageUrl,
      content: body.content !== undefined ? body.content : post.content,
      status: body.status === "draft" ? "draft" : "published",
      authorName: auth.user.name || auth.user.email || post.authorName,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    if (updated.slug !== post.slug) {
      revalidatePath(`/blog/${updated.slug}`);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/posts/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await requireAuthor();
    if (auth.error) return auth.error;

    const { slug: idOrSlug } = await params;
    let post = await getPostById(idOrSlug);
    if (!post) {
      post = await getPostBySlug(idOrSlug, { includeDrafts: true });
    }

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!canDeletePost(auth.user, post)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deletePost(post.id);

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/posts/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
