import { getPostsContainer } from "@/lib/cosmos";

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listPosts({ status = "published" } = {}) {
  const container = getPostsContainer();
  const { resources } = await container.items
    .query({
      query:
        "SELECT * FROM c WHERE c.status = @status ORDER BY c.publishedAt DESC",
      parameters: [{ name: "@status", value: status }],
    })
    .fetchAll();

  return resources;
}

export async function listAllPosts() {
  const container = getPostsContainer();
  const { resources } = await container.items
    .query({
      query: "SELECT * FROM c ORDER BY c.updatedAt DESC",
    })
    .fetchAll();

  return resources;
}

export async function getPostBySlug(slug, { includeDrafts = false } = {}) {
  const container = getPostsContainer();
  const query = includeDrafts
    ? {
        query: "SELECT * FROM c WHERE c.slug = @slug",
        parameters: [{ name: "@slug", value: slug }],
      }
    : {
        query:
          "SELECT * FROM c WHERE c.slug = @slug AND c.status = @status",
        parameters: [
          { name: "@slug", value: slug },
          { name: "@status", value: "published" },
        ],
      };

  const { resources } = await container.items.query(query).fetchAll();
  return resources[0] || null;
}

export async function getPostById(id) {
  const container = getPostsContainer();
  try {
    const { resource } = await container.item(id, id).read();
    return resource || null;
  } catch (error) {
    if (error.code === 404) return null;
    throw error;
  }
}

export async function createPost(data) {
  const container = getPostsContainer();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const slug = data.slug || slugify(data.title);

  const post = {
    id,
    slug,
    title: data.title,
    description: data.description || "",
    coverImageUrl: data.coverImageUrl || "",
    content: data.content || [],
    status: data.status || "published",
    authorId: data.authorId,
    authorName: data.authorName || "",
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === "draft" ? null : now,
  };

  const { resource } = await container.items.create(post);
  return resource;
}

export async function updatePost(id, data) {
  const existing = await getPostById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const nextStatus = data.status ?? existing.status;
  const wasPublished = existing.status === "published";
  const willPublish = nextStatus === "published";

  const post = {
    ...existing,
    ...data,
    id: existing.id,
    authorId: existing.authorId,
    authorName: data.authorName ?? existing.authorName,
    updatedAt: now,
    publishedAt:
      willPublish && !wasPublished
        ? now
        : willPublish
          ? (existing.publishedAt ?? now)
          : existing.publishedAt,
  };

  const container = getPostsContainer();
  const { resource } = await container.item(id, id).replace(post);
  return resource;
}

export async function deletePost(id) {
  const existing = await getPostById(id);
  if (!existing) return false;

  const container = getPostsContainer();
  await container.item(id, id).delete();
  return true;
}

export function toListItem(post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    cover_img: post.coverImageUrl,
    date: post.publishedAt || post.createdAt,
    authorId: post.authorId,
    authorName: post.authorName,
    status: post.status,
  };
}
