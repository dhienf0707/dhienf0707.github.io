"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import BlogPostViewer from "@/components/Blog/BlogPostViewer";
import PostEditorForm from "@/components/Blog/PostEditorForm";
import { canManagePost, canDeletePost } from "@/lib/auth-client";

export default function BlogPostContent({ post: initialPost }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState(initialPost);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  useEffect(() => {
    if (isLoading || !post) return;
    if (searchParams.get("edit") !== "1") return;
    if (!canManagePost(user, post)) return;

    setIsEditing(true);
    window.history.replaceState(null, "", `/blog/${post.slug}`);
  }, [searchParams, user, post, isLoading]);

  if (!post?.title) {
    return <ErrorMessage>Unable to load this blog post.</ErrorMessage>;
  }

  const date = post.publishedAt || post.createdAt;
  const canEdit = canManagePost(user, post);
  const canDelete = canDeletePost(user, post);

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${post.title}”?`)) return;

    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }
      router.push("/blog");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to delete post");
      setDeleting(false);
    }
  };

  if (isEditing && canEdit) {
    return (
      <PostContainer>
        <EditorHeading>Edit post</EditorHeading>
        <PostEditorForm
          key={post.id}
          post={post}
          onCancel={() => setIsEditing(false)}
          onSaved={(saved) => {
            setPost(saved);
            setIsEditing(false);
            if (saved.slug !== post.slug) {
              router.replace(`/blog/${saved.slug}`);
            }
            router.refresh();
          }}
          onDeleted={() => {
            router.push("/blog");
            router.refresh();
          }}
        />
      </PostContainer>
    );
  }

  return (
    <PostContainer>
      <PostHeader>
        {post.coverImageUrl ? (
          <CoverImage src={post.coverImageUrl} alt={post.title} />
        ) : null}
        <Title>{post.title}</Title>
        <Meta>
          {date ? new Date(date).toLocaleDateString() : null}
          {post.authorName ? ` · ${post.authorName}` : null}
        </Meta>
        {(canEdit || canDelete) && (
          <ManageActions>
            {canEdit && (
              <ActionButton type="button" onClick={() => setIsEditing(true)}>
                Edit
              </ActionButton>
            )}
            {canDelete && (
              <ActionButton
                type="button"
                $variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </ActionButton>
            )}
          </ManageActions>
        )}
        {error ? <ErrorText>{error}</ErrorText> : null}
      </PostHeader>
      <BlogPostViewer content={post.content} />
    </PostContainer>
  );
}

const PostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const EditorHeading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const PostHeader = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const CoverImage = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Meta = styled.p`
  font-size: 1rem;
  color: #666;
`;

const ManageActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: ${({ $variant }) => ($variant === "danger" ? "#fff" : "#007bff")};
  color: ${({ $variant }) => ($variant === "danger" ? "#c0392b" : "#fff")};
  border: 1px solid
    ${({ $variant }) => ($variant === "danger" ? "#c0392b" : "#007bff")};
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

const ErrorText = styled.p`
  color: #c0392b;
  margin-top: 0.75rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
`;
