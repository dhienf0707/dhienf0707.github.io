# Portfolio

Personal portfolio site built with Next.js, BlockNote, Cosmos DB, Auth0, and Azure Blob Storage.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in all values for local development (see [Environment variables](#environment-variables)).

## Deployment

The app deploys to **Azure Static Web Apps** via **GitHub Actions** on push to `master`.

### 1. Azure Static Web App

1. In the [Azure Portal](https://portal.azure.com), create a **Static Web App**.
2. Under **Deployment details**, choose **GitHub** and authorize Azure to access your repo.
3. Select this repository and branch (`master`).
4. Use these build settings (they match `.github/workflows/azure-static-web-apps-*.yml`):

   | Setting | Value |
   |---|---|
   | App location | `/` |
   | Api location | *(leave empty)* |
   | Output location | *(leave empty)* |

5. Finish creation. Azure adds a GitHub Actions workflow and a deployment token secret (named `AZURE_STATIC_WEB_APPS_API_TOKEN_<...>`) to the repo automatically.

After the first deploy, open the Static Web App → **Configuration** → **Application settings** and add the [server-side variables](#azure-static-web-app-server--runtime) listed below.

### 2. GitHub Actions

The workflow in `.github/workflows/` runs on every push to `master` and on pull requests (preview environments).

- **Build & deploy** — checks out the repo, builds the Next.js app, and uploads to Azure Static Web Apps.
- **Close PR** — tears down preview environments when a PR is closed.

You normally do not edit the workflow except to pass [client-side build variables](#github-actions-client--build-time) in the `env:` block of the **Build And Deploy** step (already configured for EmailJS and the Auth0 roles claim).

### 3. Where to put environment variables

Next.js splits variables by when and where they are read:

| Location | When used | Which keys |
|---|---|---|
| **Azure Static Web App** → Configuration → Application settings | Server runtime (API routes, auth, Cosmos DB, blob uploads) | All secrets **without** the `NEXT_PUBLIC_` prefix |
| **GitHub** → Settings → Secrets and variables → Actions | Build time (inlined into the client bundle) | All `NEXT_PUBLIC_*` keys |
| **`.env.local`** | Local development only | All keys from `.env.example` |

Never commit secrets. Do not put server-side keys in GitHub Actions unless you have a specific reason — they belong in Azure application settings.

#### Azure Static Web App (server / runtime)

Add these in **Azure Portal → Static Web App → Configuration → Application settings**:

| Variable | Description |
|---|---|
| `APP_BASE_URL` | Production site URL, e.g. `https://your-app.azurestaticapps.net` |
| `AUTH0_DOMAIN` | Auth0 tenant domain, e.g. `your-tenant.us.auth0.com` |
| `AUTH0_CLIENT_ID` | Auth0 application Client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application Client Secret |
| `AUTH0_SECRET` | Random 64-char hex string for session encryption (`openssl rand -hex 32`) |
| `AUTH0_ROLES_CLAIM` | Custom claim namespace for roles, e.g. `https://your-domain.com/roles` |
| `COSMOS_ENDPOINT` | Cosmos DB account URI |
| `COSMOS_KEY` | Cosmos DB primary (or secondary) key |
| `COSMOS_DATABASE` | Database name (default: `portfolio`) |
| `COSMOS_CONTAINER` | Container name (default: `posts`) |
| `AZURE_STORAGE_CONNECTION_STRING` | Storage account connection string |
| `AZURE_STORAGE_CONTAINER_NAME` | Blob container name (default: `blog-images`) |

#### GitHub Actions (client / build-time)

Add these in **GitHub → Repository → Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_<...>` | Added automatically when Azure connects the repo |
| `NEXT_PUBLIC_AUTH0_ROLES_CLAIM` | Same value as `AUTH0_ROLES_CLAIM` (client reads roles from the ID token) |
| `NEXT_PUBLIC_SERVICEID` | EmailJS service ID (contact form) |
| `NEXT_PUBLIC_TEMPLATEID` | EmailJS template ID |
| `NEXT_PUBLIC_USERID` | EmailJS public user ID |

The workflow passes the `NEXT_PUBLIC_*` secrets into the build step:

```yaml
env:
  NEXT_PUBLIC_AUTH0_ROLES_CLAIM: ${{ secrets.NEXT_PUBLIC_AUTH0_ROLES_CLAIM }}
  NEXT_PUBLIC_SERVICEID: ${{ secrets.NEXT_PUBLIC_SERVICEID }}
  NEXT_PUBLIC_TEMPLATEID: ${{ secrets.NEXT_PUBLIC_TEMPLATEID }}
  NEXT_PUBLIC_USERID: ${{ secrets.NEXT_PUBLIC_USERID }}
```

If you add new `NEXT_PUBLIC_*` variables, add them both as GitHub secrets and in this `env:` block.

## Environment variables

Local development uses a single `.env.local` file with every key from `.env.example`:

```env
# Cosmos DB
COSMOS_ENDPOINT=
COSMOS_KEY=
COSMOS_DATABASE=portfolio
COSMOS_CONTAINER=posts

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=blog-images

# Auth0
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
AUTH0_ROLES_CLAIM=https://portfolio.local/roles
NEXT_PUBLIC_AUTH0_ROLES_CLAIM=https://portfolio.local/roles

# EmailJS (contact form)
NEXT_PUBLIC_SERVICEID=
NEXT_PUBLIC_TEMPLATEID=
NEXT_PUBLIC_USERID=
```

For production, split them as described in [Where to put environment variables](#3-where-to-put-environment-variables).

## Auth0

### Application setup

1. Create a **Regular Web Application** in the [Auth0 Dashboard](https://manage.auth0.com/).
2. Copy **Domain**, **Client ID**, and **Client Secret** into your environment.
3. Set URLs (replace with your production domain when deploying):

   | Setting | Local | Production |
   |---|---|---|
   | Allowed Callback URLs | `http://localhost:3000/auth/callback` | `https://your-app.azurestaticapps.net/auth/callback` |
   | Allowed Logout URLs | `http://localhost:3000` | `https://your-app.azurestaticapps.net` |
   | Allowed Web Origins | `http://localhost:3000` | `https://your-app.azurestaticapps.net` |

4. Generate `AUTH0_SECRET` with `openssl rand -hex 32`.

### Roles (RBAC)

The blog uses two roles:

| Role | Permissions |
|---|---|
| `author` | Create posts; edit own posts |
| `admin` | Create, edit any post, delete posts |

Setup:

1. In Auth0 → **User Management → Roles**, create `admin` and `author`.
2. Enable **RBAC** on your API (or use the Authorization Extension roles in the token).
3. Add a **Login / Post Login** Action that writes roles into a custom claim. The claim URL must match `AUTH0_ROLES_CLAIM` and `NEXT_PUBLIC_AUTH0_ROLES_CLAIM`:

```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://portfolio.local"; // use your production namespace in prod
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
};
```

4. Attach the Action to the Login flow.
5. Assign `admin` or `author` to users under **User Management → Users → Roles**.

Use the same namespace in both `AUTH0_ROLES_CLAIM` and `NEXT_PUBLIC_AUTH0_ROLES_CLAIM` (e.g. `https://your-domain.com/roles`).

## Cosmos DB

Blog posts are stored in Azure Cosmos DB for NoSQL.

### Setup

1. Create a **Cosmos DB account** (API: **NoSQL**) in Azure.
2. Create a database named `portfolio` (or set `COSMOS_DATABASE`).
3. Create a container named `posts` (or set `COSMOS_CONTAINER`) with:
   - **Partition key**: `/id`
4. Under **Keys**, copy the **URI** → `COSMOS_ENDPOINT` and **Primary Key** → `COSMOS_KEY`.

### Environment keys

| Variable | Where (prod) | Value |
|---|---|---|
| `COSMOS_ENDPOINT` | Azure | Account URI from Keys blade |
| `COSMOS_KEY` | Azure | Primary or secondary key |
| `COSMOS_DATABASE` | Azure | `portfolio` |
| `COSMOS_CONTAINER` | Azure | `posts` |

No Cosmos keys are needed in GitHub — they are server-only.

## Azure Blob Storage

Cover images and in-editor uploads are stored in Azure Blob Storage.

### Setup

1. Create a **Storage account** in Azure.
2. Create a blob container named `blog-images` (or set `AZURE_STORAGE_CONTAINER_NAME`).
3. Set the container **Public access level** to **Blob (anonymous read access for blobs only)** so image URLs are publicly readable.
4. Under **Access keys**, copy the **Connection string** → `AZURE_STORAGE_CONNECTION_STRING`.

Uploaded files are stored under `covers/` and `posts/` prefixes inside the container.

### Environment keys

| Variable | Where (prod) | Value |
|---|---|---|
| `AZURE_STORAGE_CONNECTION_STRING` | Azure | Storage account connection string |
| `AZURE_STORAGE_CONTAINER_NAME` | Azure | `blog-images` (or your container name) |

No storage keys are needed in GitHub — uploads run on the server via `/api/uploads`.

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
