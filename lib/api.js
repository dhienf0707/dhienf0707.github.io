import { listPosts, getPostBySlug, toListItem } from "@/lib/posts";

export const getBlogPosts = async () => {
  try {
    const posts = await listPosts({ status: "published" });
    return posts.map(toListItem);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const getBlogPost = async (slug) => {
  try {
    return await getPostBySlug(slug);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};
