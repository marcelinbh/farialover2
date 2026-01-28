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

describe("profiles.list", () => {
  it("should fetch profiles from Supabase", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const profiles = await caller.profiles.list();

    expect(profiles).toBeDefined();
    expect(Array.isArray(profiles)).toBe(true);
    
    if (profiles.length > 0) {
      const profile = profiles[0];
      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("name");
      expect(profile).toHaveProperty("age");
      expect(profile).toHaveProperty("phone");
      expect(profile).toHaveProperty("photos");
      expect(Array.isArray(profile.photos)).toBe(true);
    }
  });

  it("should include photos for each profile", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const profiles = await caller.profiles.list();

    if (profiles.length > 0) {
      const profilesWithPhotos = profiles.filter(p => p.photos.length > 0);
      expect(profilesWithPhotos.length).toBeGreaterThan(0);
      
      const firstProfile = profilesWithPhotos[0];
      const firstPhoto = firstProfile.photos[0];
      expect(firstPhoto).toHaveProperty("url");
      expect(firstPhoto).toHaveProperty("profile_id");
      expect(firstPhoto.profile_id).toBe(firstProfile.id);
    }
  });
});
