import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth0 } from "@/lib/auth0";
import { canEditPosts } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  coverImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth0.getSession();
      if (!session?.user || !canEditPosts(session.user)) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: session.user.sub };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl || file.url };
    }),

  postImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth0.getSession();
      if (!session?.user || !canEditPosts(session.user)) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: session.user.sub };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl || file.url };
    }),
};

export default ourFileRouter;
