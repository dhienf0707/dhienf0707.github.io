import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getBlogPost } from "../../services/api";
import { Skeleton } from "../Skeleton";

import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Collection } from 'react-notion-x/build/third-party/collection'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-docker.js'
import 'prismjs/components/prism-yaml.js'
import 'prismjs/components/prism-powershell.js'
import 'prismjs/components/prism-toml.js'

const PostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PostHeader = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const DateTime = styled.p`
  font-size: 1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
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

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogPost(slug);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blog post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PostContainer>
      {loading ? (
        <>
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
        </>
      ) : (
        <>
          <PostHeader>
            <Title>{post.page.properties.Name.title[0]?.plain_text}</Title>
            {post.page.properties.Date?.date?.start && (
              <DateTime>
                {new Date(post.page.properties.Date.date.start).toLocaleDateString()}
              </DateTime>
            )}
          </PostHeader>
          <NotionRenderer
              recordMap={post.recordMap}
              components={{
                Code,
                Collection
              }}
            />
        </>
      )}
    </PostContainer>
  );
};
export default BlogPost; 