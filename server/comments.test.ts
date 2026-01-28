import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("comments", () => {
  describe("comments.list", () => {
    it("should fetch comments for a profile", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const comments = await caller.comments.list({ profileId: 1 });

      expect(Array.isArray(comments)).toBe(true);
      if (comments.length > 0) {
        expect(comments[0]).toHaveProperty("id");
        expect(comments[0]).toHaveProperty("profile_id");
        expect(comments[0]).toHaveProperty("author_name");
        expect(comments[0]).toHaveProperty("comment_text");
        expect(comments[0]).toHaveProperty("created_at");
        expect(comments[0]).toHaveProperty("approved");
        expect(comments[0].approved).toBe(true);
      }
    });
  });

  describe("comments.create", () => {
    it("should create a new comment", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const newComment = await caller.comments.create({
        profileId: 1,
        authorName: "Test User",
        commentText: "This is a test comment",
      });

      expect(newComment).toHaveProperty("id");
      expect(newComment.profile_id).toBe(1);
      expect(newComment.author_name).toBe("Test User");
      expect(newComment.comment_text).toBe("This is a test comment");
      expect(newComment.approved).toBe(false); // New comments should be pending approval
    });
  });
});
