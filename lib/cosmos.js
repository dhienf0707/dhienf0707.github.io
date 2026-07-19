import { CosmosClient } from "@azure/cosmos";
import https from "https";

let client;
let container;

function getConfig() {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const agent = new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV === "production" ? true : false,
  });
  const databaseId = process.env.COSMOS_DATABASE || "portfolio";
  const containerId = process.env.COSMOS_CONTAINER || "posts";

  if (!endpoint || !key) {
    throw new Error(
      "Missing COSMOS_ENDPOINT or COSMOS_KEY environment variables"
    );
  }

  return { endpoint, key, databaseId, containerId, agent };
}

export function getPostsContainer() {
  if (container) return container;

  const { endpoint, key, databaseId, containerId, agent } = getConfig();
  client = new CosmosClient({ endpoint, key, agent });
  container = client.database(databaseId).container(containerId);
  return container;
}
