"use client";

import styled from "styled-components";
import { Skeleton } from "@/components/Skeleton";

const PostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const SkeletonHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function BlogPostSkeleton() {
  return (
    <PostContainer>
      <SkeletonHeader>
        <Skeleton height="48px" width="80%" />
        <Skeleton height="24px" width="40%" />
      </SkeletonHeader>
      <SkeletonContent>
        <Skeleton height="24px" width="100%" />
        <Skeleton height="24px" width="100%" />
        <Skeleton height="24px" width="80%" />
        <Skeleton height="200px" width="100%" />
        <Skeleton height="24px" width="100%" />
        <Skeleton height="24px" width="90%" />
        <Skeleton height="24px" width="95%" />
      </SkeletonContent>
    </PostContainer>
  );
}
