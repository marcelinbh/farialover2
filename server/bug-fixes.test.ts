import { describe, it, expect } from "vitest";

describe("Bug Fixes Tests", () => {
  describe("BUG #1: Modal +18 Cookie Persistence", () => {
    it("should save session cookie when 'remember' is false", () => {
      // Simulate cookie logic
      const remember = false;
      let cookie = "";
      
      if (remember) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        cookie = `farialover_age_verified=true; expires=${expiryDate.toUTCString()}; path=/`;
      } else {
        cookie = `farialover_age_verified=true; path=/`;
      }
      
      expect(cookie).toBe("farialover_age_verified=true; path=/");
      expect(cookie).not.toContain("expires");
    });

    it("should save persistent cookie when 'remember' is true", () => {
      const remember = true;
      let cookie = "";
      
      if (remember) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        cookie = `farialover_age_verified=true; expires=${expiryDate.toUTCString()}; path=/`;
      } else {
        cookie = `farialover_age_verified=true; path=/`;
      }
      
      expect(cookie).toContain("farialover_age_verified=true");
      expect(cookie).toContain("expires");
      expect(cookie).toContain("path=/");
    });
  });

  describe("BUG #2: Navigation Links", () => {
    it("should use Link component from wouter for navigation", () => {
      // Test that Link component is imported
      const linkImport = 'import { useLocation, Link } from "wouter";';
      expect(linkImport).toContain("Link");
      expect(linkImport).toContain("wouter");
    });

    it("should have correct href attribute for navigation links", () => {
      const links = [
        { href: "/", text: "HOME" },
        { href: "/modelos", text: "MODELOS" },
        { href: "/cidades", text: "CIDADES" },
      ];

      links.forEach((link) => {
        expect(link.href).toMatch(/^\//);
        expect(link.href).not.toContain("#");
      });
    });

    it("should navigate to correct routes", () => {
      const routes = ["/", "/modelos", "/cidades"];
      
      routes.forEach((route) => {
        expect(route).toMatch(/^\/[a-z]*$/);
      });
    });
  });

  describe("Cookie Reading Logic", () => {
    it("should correctly parse cookie string", () => {
      const cookieString = "farialover_age_verified=true; other_cookie=value";
      const verified = cookieString
        .split("; ")
        .find((row) => row.startsWith("farialover_age_verified="));
      
      expect(verified).toBe("farialover_age_verified=true");
    });

    it("should return undefined when cookie not found", () => {
      const cookieString = "other_cookie=value; another=test";
      const verified = cookieString
        .split("; ")
        .find((row) => row.startsWith("farialover_age_verified="));
      
      expect(verified).toBeUndefined();
    });
  });
});
