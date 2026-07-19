"use client";

import styled from "styled-components";
import { Skeleton } from "@/components/Skeleton";

const BlogSection = styled.section`
  padding: 4rem 2rem;
  background-color: #f1f3f5;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: bold;
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

const SkeletonCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SkeletonImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  flex-shrink: 0;
`;

const SkeletonContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default function BlogListSkeleton() {
  return (
    <BlogSection>
      <SectionTitle>Blog Posts</SectionTitle>
      <PostsGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index}>
            <SkeletonImageContainer>
              <Skeleton height="100%" />
            </SkeletonImageContainer>
            <SkeletonContent>
              <Skeleton height="24px" width="80%" />
              <Skeleton height="16px" width="60%" />
              <Skeleton height="16px" width="90%" />
              <Skeleton height="16px" width="40%" />
            </SkeletonContent>
          </SkeletonCard>
        ))}
      </PostsGrid>
    </BlogSection>
  );
}
