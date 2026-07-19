"use client";

import dynamic from "next/dynamic";
import styled from "styled-components";

const BlogEditor = dynamic(() => import("@/components/Blog/BlogEditor"), {
  ssr: false,
  loading: () => <LoadingText>Loading editor…</LoadingText>,
});

const LoadingText = styled.p`
  color: #666;
  padding: 1rem 0;
`;

export default function BlogPostViewer({ content }) {
  if (!content || content.length === 0) {
    return <Empty>This post has no content yet.</Empty>;
  }

  return <BlogEditor initialContent={content} editable={false} />;
}

const Empty = styled.p`
  color: #666;
  text-align: center;
  padding: 2rem 0;
`;
