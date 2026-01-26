import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const adminUser: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@farialover.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const regularUser: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: regularUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin.getStats", () => {
  it("should return statistics for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.getStats();

    expect(stats).toHaveProperty("totalProfiles");
    expect(stats).toHaveProperty("activeProfiles");
    expect(stats).toHaveProperty("pendingApproval");
    expect(stats).toHaveProperty("vipProfiles");
    expect(stats).toHaveProperty("featuredProfiles");
    expect(stats).toHaveProperty("totalPayments");
    expect(stats).toHaveProperty("pendingPayments");
    expect(stats).toHaveProperty("confirmedPayments");
    expect(stats).toHaveProperty("totalRevenue");
    expect(stats).toHaveProperty("pendingComments");
    expect(stats).toHaveProperty("approvedComments");
    
    expect(typeof stats.totalProfiles).toBe("number");
    expect(typeof stats.totalRevenue).toBe("string");
  });

  it("should throw FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getStats()).rejects.toThrow("Admin access required");
  });
});

describe("admin.getPayments", () => {
  it("should return payments list for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const payments = await caller.admin.getPayments();

    expect(Array.isArray(payments)).toBe(true);
  });

  it("should throw FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getPayments()).rejects.toThrow("Admin access required");
  });
});

describe("admin.getLogs", () => {
  it("should return admin logs for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const logs = await caller.admin.getLogs();

    expect(Array.isArray(logs)).toBe(true);
  });

  it("should throw FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getLogs()).rejects.toThrow("Admin access required");
  });
});
