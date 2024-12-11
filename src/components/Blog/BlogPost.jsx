import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getBlogPost } from "../../services/api";
import { Render } from '@9gustin/react-notion-render'
import '@9gustin/react-notion-render/dist/index.css'
import { Highlight, themes } from "prism-react-renderer"
import { withContentValidation } from "@9gustin/react-notion-render";

const CodeBlock = ({ plainText, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For modern browsers
        await navigator.clipboard.writeText(plainText);
      } else {
        // Fallback for iOS
        const textArea = document.createElement("textarea");
        textArea.value = plainText;
        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (error) {
          console.error('Copy failed:', error);
        }
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <CodeBlockWrapper>
      <CopyButton onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </CopyButton>
      <Highlight theme={themes.github} code={plainText} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className} style={style}>
            {tokens.map((line, i) => (
              <Line key={i} {...getLineProps({ line, key: i })}>
                <LineNo>{i + 1}</LineNo>
                <LineContent>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </LineContent>
              </Line>
            ))}
          </Pre>
        )}
      </Highlight>
    </CodeBlockWrapper>
  );
};

const CodeBlockWrapper = styled.div`
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  &:active {
    background-color: #e5e7eb;
  }
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

  if (loading) return <LoadingMessage>Loading post...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!post) return <ErrorMessage>Post not found</ErrorMessage>;

  return (
    <PostContainer>
      <PostHeader>
        <Title>{post.page.properties.Name.title[0]?.plain_text}</Title>
        {
          post.page.properties.Date?.date?.start
            ?
            <DateTime>
              {new Date(post.page.properties.Date?.date?.start).toLocaleDateString()}
            </DateTime>
            : ''
        }
      </PostHeader>
      <Content>
        <Render
          blocks={post.blocks}
          blockComponentsMapper={{
            code: withContentValidation(CodeBlock)
          }}
        />
      </Content>
    </PostContainer>
  );
};

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

const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow: auto;
  border-radius: 6px;
  background-color: #f6f8fa !important;
`;

const Line = styled.div`
  display: table-row;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  display: table-cell;
`;

const Content = styled.div`
  line-height: 1.8;
  color: #444;

  h1, h2, h3 {
    margin: 2rem 0 1rem;
    color: #333;
  }

  p {
    margin-bottom: 1.5rem;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    text-decoration: none;
    color: #007bff;
    transition: text-decoration 0.3s ease;

    &:hover {
      text-decoration: underline;
    }
  }

  /* Inline code styling */
  p > code {
    background-color: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'source-code-pro', Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* Comments styling */
  .comment {
    color: #6a737d;
  }

  /* Function and keyword styling */
  .function, .keyword {
    color: #0550ae;
  }

  /* String styling */
  .string {
    color: #24292e;
  }
`;


const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
`;

export default BlogPost; 