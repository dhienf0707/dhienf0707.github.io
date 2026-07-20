const BLOG_LIST_STALE_KEY = "blog-list-stale";

export function markBlogListStale() {
  try {
    sessionStorage.setItem(BLOG_LIST_STALE_KEY, "1");
  } catch {
    // sessionStorage may be unavailable
  }
}

export function consumeBlogListStale() {
  try {
    if (sessionStorage.getItem(BLOG_LIST_STALE_KEY) !== "1") return false;
    sessionStorage.removeItem(BLOG_LIST_STALE_KEY);
    return true;
  } catch {
    return false;
  }
}
