import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: ${props => props.height || '100%'};
  width: ${props => props.width || '100%'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const Skeleton = ({ count = 1, ...rest }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <SkeletonPulse key={i} {...rest} />
    ))}
  </>
);

