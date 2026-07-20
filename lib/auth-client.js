const ROLES_CLAIM =
  process.env.NEXT_PUBLIC_AUTH0_ROLES_CLAIM || "https://portfolio.local/roles";

export function getUserRoles(user) {
  if (!user) return [];
  const roles = user[ROLES_CLAIM] || user.roles || [];
  return Array.isArray(roles) ? roles : [];
}

export function hasRole(user, role) {
  return getUserRoles(user).includes(role);
}

export function canEditPosts(user) {
  return hasRole(user, "admin") || hasRole(user, "author");
}

/** Authors can edit their own posts; admins can edit any post. */
export function canManagePost(user, post) {
  if (!user || !post) return false;
  if (hasRole(user, "admin")) return true;
  if (hasRole(user, "author") && post.authorId === user.sub) return true;
  return false;
}

/** Authors can delete their own posts; admins can delete any post. */
export function canDeletePost(user, post) {
  if (!user || !post) return false;
  if (hasRole(user, "admin")) return true;
  if (hasRole(user, "author") && post.authorId === user.sub) return true;
  return false;
}
