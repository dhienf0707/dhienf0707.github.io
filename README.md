# Portfolio

Personal portfolio site built with Next.js, BlockNote, Cosmos DB, Auth0, and Azure Blob Storage.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```env
# Cosmos DB config
COSMOS_ENDPOINT=
COSMOS_KEY=
COSMOS_DATABASE=portfolio
COSMOS_CONTAINER=posts

# Azure Blob Storage config
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=blog-images

# AUTH0 CONFIGS
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
AUTH0_ROLES_CLAIM=https://portfolio.local/roles
NEXT_PUBLIC_AUTH0_ROLES_CLAIM=https://portfolio.local/roles

# emailjs config
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

Create a database `portfolio` and container `posts` with partition key `/id`.

### Azure Blob Storage

Create a storage account and a container (default name: `blog-images`). Enable **Blob anonymous read access for this container only** so uploaded cover and post images are publicly readable. Set the connection string and container name in your environment. Blobs are stored under `covers/` and `posts/` prefixes.

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

