# Portfolio

Personal portfolio site built with Next.js, BlockNote, Cosmos DB, Auth0, and UploadThing.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```env
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
APP_BASE_URL=http://localhost:3000
AUTH0_ROLES_CLAIM=https://portfolio.local/roles
NEXT_PUBLIC_AUTH0_ROLES_CLAIM=https://portfolio.local/roles

COSMOS_ENDPOINT=
COSMOS_KEY=
COSMOS_DATABASE=portfolio
COSMOS_CONTAINER=posts

UPLOADTHING_TOKEN=

NEXT_PUBLIC_SERVICEID=
NEXT_PUBLIC_TEMPLATEID=
NEXT_PUBLIC_USERID=
```

### Auth0 roles

Create roles `admin` and `author` in Auth0 Authorization (RBAC). Add an Action (Login / Post Login) that sets the custom claim matching `AUTH0_ROLES_CLAIM`, for example:

```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://portfolio.local";
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
};
```

Assign users the `admin` or `author` role. Callback URL: `{APP_BASE_URL}/auth/callback`. Logout URL: `{APP_BASE_URL}`.

### Cosmos DB

Create a database/container (`posts`) with partition key `/id`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — run production server
- `npm run lint` — ESLint

## Routes

- `/blog` — post list; **Add** opens the editor inline; **Edit** opens the post in edit mode; **Delete** (admin)
- `/blog/[slug]` — post view; **Edit** / **Delete** toggle in place (no separate edit route)
- `/api/posts` — GET list, POST create
- `/api/posts/[slug]` — GET by slug; PUT by id/slug; DELETE admin-only
