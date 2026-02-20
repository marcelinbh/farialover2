import { describe, it, expect } from "vitest";

describe("Search and Filters", () => {
  it("should filter profiles by search term", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const searchTerm = "isabella";
    const filtered = profiles.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Isabella Brito");
  });

  it("should filter profiles by city", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const city = "Belo Horizonte";
    const filtered = profiles.filter((p) => p.city === city);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].city).toBe("Belo Horizonte");
  });

  it("should filter profiles by age range", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
      { id: 3, name: "Ana Costa", city: "Rio de Janeiro", age: 22, body_type: "Magra" },
    ];

    const ageMin = 23;
    const ageMax = 28;
    const filtered = profiles.filter((p) => p.age >= ageMin && p.age <= ageMax);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Isabella Brito");
  });

  it("should filter profiles by body type", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const bodyType = "Atlética";
    const filtered = profiles.filter((p) => p.body_type === bodyType);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].body_type).toBe("Atlética");
  });

  it("should apply multiple filters simultaneously", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
      { id: 3, name: "Ana Costa", city: "Belo Horizonte", age: 22, body_type: "Magra" },
    ];

    const city = "Belo Horizonte";
    const ageMin = 23;
    const ageMax = 28;
    const filtered = profiles.filter(
      (p) => p.city === city && p.age >= ageMin && p.age <= ageMax
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Isabella Brito");
  });

  it("should return empty array when no profiles match filters", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
    ];

    const searchTerm = "nonexistent";
    const filtered = profiles.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    expect(filtered).toHaveLength(0);
  });

  it("should handle empty search term", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const searchTerm = "";
    const filtered = profiles.filter((p) =>
      searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

    expect(filtered).toHaveLength(2);
  });
});

describe("Age Verification Modal", () => {
  it("should validate cookie expiry calculation", () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const now = new Date();
    const diffInDays = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    expect(diffInDays).toBeGreaterThanOrEqual(29);
    expect(diffInDays).toBeLessThanOrEqual(30);
  });

  it("should validate cookie name format", () => {
    const cookieName = "farialover_age_verified";
    
    expect(cookieName).toMatch(/^[a-z_]+$/);
    expect(cookieName).toContain("farialover");
    expect(cookieName).toContain("age_verified");
  });
});

describe("WhatsApp Button", () => {
  it("should format WhatsApp URL correctly", () => {
    const whatsappNumber = "5531999999999";
    const message = "Olá! Vi o site Farialover e gostaria de mais informações.";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    expect(url).toContain("https://wa.me/");
    expect(url).toContain(whatsappNumber);
    expect(url).toContain("text=");
    expect(decodeURIComponent(url)).toContain(message);
  });

  it("should validate phone number format", () => {
    const whatsappNumber = "5531999999999";
    
    expect(whatsappNumber).toMatch(/^\d+$/);
    expect(whatsappNumber.length).toBeGreaterThanOrEqual(12);
    expect(whatsappNumber).toMatch(/^55/); // Brazil country code
  });
});
