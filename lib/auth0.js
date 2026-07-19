import {
  Auth0Client,
  filterDefaultIdTokenClaims,
} from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
  },
  async beforeSessionSaved(session) {
    const customClaims = filterDefaultIdTokenClaims(session.user);

    return {
      ...session,
      user: {
        ...session.user,
        ...customClaims,
      },
    };
  },
});
