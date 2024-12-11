import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../../services/api";
import { Skeleton } from "../Skeleton";

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
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 20px;
width: 100%;
max-width: 1200px;
`;

const PostCard = styled.div`
background-color: white;
border-radius: 10px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
transition: transform 0.3s ease-in-out;
overflow: hidden;

&:hover {
  transform: translateY(-5px);
}
`;

const PostInfo = styled.div`
padding: 1.5rem;
`;

const PostTitle = styled.h3`
font-size: 1.5rem;
margin-bottom: 0.5rem;
color: #333;
word-break: break-word;
overflow-wrap: anywhere;
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

const ReadMoreLink = styled(Link)`
color: #007bff;
text-decoration: none;
font-weight: bold;

&:hover {
  text-decoration: underline;
}
`;

const ErrorMessage = styled.div`
text-align: center;
padding: 2rem;
color: #dc3545;
font-size: 1.2rem;
`;

const SkeletonCard = styled(PostCard)`
overflow: hidden;
`;

const SkeletonContent = styled.div`
padding: 1.5rem;
display: flex;
flex-direction: column;
gap: 0.5rem;
`;

const PostImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9; /* Ensures consistent aspect ratio */
  overflow: hidden;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blog posts");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <BlogSection>
      <SectionTitle>Blog Posts</SectionTitle>
      <PostsGrid>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index}>
              <Skeleton height="200px" />
              <SkeletonContent>
                <Skeleton height="24px" width="80%" />
                <Skeleton height="16px" width="60%" />
                <Skeleton height="16px" width="90%" />
                <Skeleton height="16px" width="40%" />
              </SkeletonContent>
            </SkeletonCard>
          ))
          : posts.map((post) => (
            <PostCard key={post.id}>
              {post.cover_img && (
                <PostImageContainer>
                  <PostImage src={post.cover_img} alt={post.title} />
                </PostImageContainer>
              )}
              <PostInfo>
                <PostTitle>{post.title}</PostTitle>
                <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
                <PostDescription>{post.description}</PostDescription>
                <ReadMoreLink to={`/blog/${post.slug}`}>Read More →</ReadMoreLink>
              </PostInfo>
            </PostCard>
          ))}
      </PostsGrid>
    </BlogSection>
  );
};

export default BlogList; 