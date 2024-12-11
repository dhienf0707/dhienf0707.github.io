const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getBlogPosts = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogPost = async (slug) => {
  try {
    const response = await fetch(`${API_URL}?slug=${slug}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}; 