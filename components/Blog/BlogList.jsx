"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  canEditPosts,
  canManagePost,
  canDeletePost,
} from "@/lib/auth-client";
import BlogListSkeleton from "@/components/Blog/BlogListSkeleton";

const PostEditorForm = dynamic(
  () => import("@/components/Blog/PostEditorForm"),
  {
    ssr: false,
    loading: () => <BlogListSkeleton />,
  }
);

export default function BlogList({ posts = [] }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const canCreate = canEditPosts(user);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete “${post.title}”?`)) return;

    setDeletingId(post.id);
    setError("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  if (isAdding) {
    return (
      <BlogSection>
        <ComposerHeader>
          <SectionTitle>New post</SectionTitle>
        </ComposerHeader>
        <PostEditorForm
          onCancel={() => setIsAdding(false)}
          onSaved={(saved) => {
            setIsAdding(false);
            router.push(`/blog/${saved.slug}`);
            router.refresh();
          }}
        />
      </BlogSection>
    );
  }

  return (
    <BlogSection>
      <HeaderRow>
        <SectionTitle>Blog Posts</SectionTitle>
        {!isLoading && canCreate && (
          <ActionButton type="button" onClick={() => setIsAdding(true)}>
            Add
          </ActionButton>
        )}
      </HeaderRow>
      {error ? <ErrorText>{error}</ErrorText> : null}
      {posts.length === 0 ? (
        <EmptyMessage>No blog posts available.</EmptyMessage>
      ) : (
        <PostsGrid>
          {posts.map((post) => {
            const canEdit = canManagePost(user, post);
            const canDelete = canDeletePost(user, post);
            return (
              <PostCard key={post.id}>
                <PostImageContainer>
                  {post.cover_img ? (
                    <PostImage src={post.cover_img} alt={post.title} />
                  ) : null}
                </PostImageContainer>
                <PostInfo>
                  <PostTitle>{post.title}</PostTitle>
                  <PostDate>
                    {new Date(post.date).toLocaleDateString()}
                  </PostDate>
                  <PostDescription>{post.description}</PostDescription>
                  <CardActions>
                    <ReadMoreLink href={`/blog/${post.slug}`}>
                      Read More →
                    </ReadMoreLink>
                    {(canEdit || canDelete) && (
                      <ManageActions>
                        {canEdit && (
                          <ActionButton
                            type="button"
                            $variant="secondary"
                            onClick={() =>
                              router.push(`/blog/${post.slug}?edit=1`)
                            }
                          >
                            Edit
                          </ActionButton>
                        )}
                        {canDelete && (
                          <ActionButton
                            type="button"
                            $variant="danger"
                            disabled={deletingId === post.id}
                            onClick={() => handleDelete(post)}
                          >
                            {deletingId === post.id ? "Deleting…" : "Delete"}
                          </ActionButton>
                        )}
                      </ManageActions>
                    )}
                  </CardActions>
                </PostInfo>
              </PostCard>
            );
          })}
        </PostsGrid>
      )}
    </BlogSection>
  );
}

const BlogSection = styled.section`
  padding: 4rem 2rem;
  background-color: #f1f3f5;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderRow = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const ComposerHeader = styled.div`
  width: 100%;
  max-width: 900px;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin: 0;
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: ${({ $variant }) =>
    $variant === "danger"
      ? "#fff"
      : $variant === "secondary"
        ? "#fff"
        : "#007bff"};
  color: ${({ $variant }) =>
    $variant === "danger"
      ? "#c0392b"
      : $variant === "secondary"
        ? "#333"
        : "#fff"};
  border: 1px solid
    ${({ $variant }) =>
      $variant === "danger"
        ? "#c0392b"
        : $variant === "secondary"
          ? "#ccc"
          : "#007bff"};
  font-weight: 700;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const PostInfo = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const PostDate = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const PostDescription = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
`;

const CardActions = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ManageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ReadMoreLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
`;

const ErrorText = styled.p`
  color: #c0392b;
  margin: 0 0 1rem;
`;

const PostImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #e9ecef;
`;
