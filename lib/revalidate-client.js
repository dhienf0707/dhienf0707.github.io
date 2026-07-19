export async function revalidateBlogPath(path) {
  const response = await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to refresh");
  }
  return data;
}
