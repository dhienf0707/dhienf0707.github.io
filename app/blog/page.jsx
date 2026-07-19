import { getBlogPosts } from "@/lib/api";
import BlogList from "@/components/Blog/BlogList";

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogList posts={posts} />;
}
