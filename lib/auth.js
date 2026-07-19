import { auth0 } from "@/lib/auth0";

const ROLES_CLAIM =
  process.env.AUTH0_ROLES_CLAIM ||
  process.env.NEXT_PUBLIC_AUTH0_ROLES_CLAIM ||
  "https://portfolio.local/roles";

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

/** Only admins can delete posts. */
export function canDeletePost(user, post) {
  if (!user || !post) return false;
  return hasRole(user, "admin");
}

export async function requireSession() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, user: session.user };
}

export async function requireAuthor() {
  const result = await requireSession();
  if (result.error) return result;
  if (!canEditPosts(result.user)) {
    return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}
