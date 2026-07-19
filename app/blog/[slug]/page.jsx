import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/api";
import BlogPostContent from "@/components/Blog/BlogPostContent";
import BlogPostSkeleton from "@/components/Blog/BlogPostSkeleton";

export const revalidate = 3600;

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent post={post} />
    </Suspense>
  );
}
