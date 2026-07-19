"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { UploadButton } from "@/lib/uploadthing";
import { slugify } from "@/lib/posts-client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { canDeletePost } from "@/lib/auth-client";

const BlogEditor = dynamic(() => import("@/components/Blog/BlogEditor"), {
  ssr: false,
  loading: () => <p>Loading editor…</p>,
});

export default function PostEditorForm({
  post = null,
  onCancel,
  onSaved,
  onDeleted,
}) {
  const { user } = useUser();
  const isNew = !post;
  const showDelete = !isNew && canDeletePost(user, post);

  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || "");
  const [content, setContent] = useState(post?.content || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const snapshot = useMemo(
    () =>
      JSON.stringify({
        title: post?.title || "",
        description: post?.description || "",
        slug: post?.slug || "",
        coverImageUrl: post?.coverImageUrl || "",
        content: post?.content || [],
      }),
    [post]
  );

  const current = JSON.stringify({
    title,
    description,
    slug,
    coverImageUrl,
    content,
  });
  const isDirty = current !== snapshot;

  const handleTitleChange = (value) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const publish = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!title.trim()) {
        throw new Error("Title is required");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        slug: slug.trim() || slugify(title),
        coverImageUrl,
        content,
        status: "published",
      };

      const response = await fetch(
        isNew ? "/api/posts" : `/api/posts/${post.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to publish");
      }

      setMessage("Published successfully");
      onSaved?.(data);
    } catch (err) {
      setError(err.message || "Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (isNew || !post?.id) return;
    if (!window.confirm("Delete this post permanently?")) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete");
      }
      onDeleted?.(post);
    } catch (err) {
      setError(err.message || "Failed to delete");
      setSaving(false);
    }
  };

  return (
    <Form>
      <Field>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
        />
      </Field>

      <Field>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="my-post-slug"
        />
      </Field>

      <Field>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short summary for the blog list"
          rows={3}
        />
      </Field>

      <Field>
        <Label>Cover image</Label>
        {coverImageUrl ? (
          <CoverPreview>
            <img src={coverImageUrl} alt="Cover" />
            <RemoveCover type="button" onClick={() => setCoverImageUrl("")}>
              Remove cover
            </RemoveCover>
          </CoverPreview>
        ) : (
          <UploadButton
            endpoint="coverImage"
            onClientUploadComplete={(res) => {
              const file = res?.[0];
              if (file) {
                setCoverImageUrl(file.ufsUrl || file.url);
              }
            }}
            onUploadError={(err) => setError(err.message)}
          />
        )}
      </Field>

      <Field>
        <Label>Content</Label>
        <EditorShell>
          <BlogEditor
            key={post?.id || "new"}
            initialContent={post?.content}
            editable
            onChange={setContent}
          />
        </EditorShell>
      </Field>

      <Actions>
        <PrimaryButton type="button" onClick={publish} disabled={saving}>
          {saving ? "Publishing…" : "Publish"}
        </PrimaryButton>
        {onCancel && (
          <SecondaryButton type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </SecondaryButton>
        )}
        {showDelete && (
          <DangerButton type="button" onClick={remove} disabled={saving}>
            Delete
          </DangerButton>
        )}
        <Status>
          {isDirty ? "Unsaved changes" : "No changes"}
          {message ? ` · ${message}` : ""}
        </Status>
      </Actions>
      {error && <ErrorText>{error}</ErrorText>}
    </Form>
  );
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 900px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
`;

const EditorShell = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 320px;
  background: #fff;
  overflow: hidden;
`;

const CoverPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  img {
    width: 100%;
    max-height: 240px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const RemoveCover = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: #c0392b;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

const PrimaryButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.7rem 1.1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DangerButton = styled.button`
  background: #fff;
  color: #c0392b;
  border: 1px solid #c0392b;
  border-radius: 6px;
  padding: 0.7rem 1.1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Status = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ErrorText = styled.p`
  color: #c0392b;
  margin: 0;
`;
