import { describe, it, expect } from "vitest";

describe("Página MODELOS", () => {
  it("should filter profiles by search term", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const searchTerm = "maria";
    const filtered = profiles.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Maria Silva");
  });

  it("should display all profiles when no filters applied", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const filteredProfiles = profiles;
    const displayProfiles = filteredProfiles.length > 0 ? filteredProfiles : profiles;

    expect(displayProfiles).toHaveLength(2);
  });

  it("should count profiles correctly", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
      { id: 3, name: "Ana Costa", city: "Rio de Janeiro", age: 22, body_type: "Magra" },
    ];

    expect(profiles.length).toBe(3);
    expect(profiles.length === 1 ? 'modelo encontrada' : 'modelos encontradas').toBe('modelos encontradas');
  });
});

describe("Página CIDADES", () => {
  it("should extract unique cities from profiles", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
      { id: 3, name: "Ana Costa", city: "Belo Horizonte", age: 22, body_type: "Magra" },
    ];

    const uniqueCities = Array.from(new Set(profiles.map(p => p.city)));
    const cities = ["Todas", ...uniqueCities.sort()];

    expect(cities).toContain("Todas");
    expect(cities).toContain("Belo Horizonte");
    expect(cities).toContain("São Paulo");
    expect(cities.length).toBe(3); // Todas + 2 unique cities
  });

  it("should count profiles per city correctly", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
      { id: 3, name: "Ana Costa", city: "Belo Horizonte", age: 22, body_type: "Magra" },
    ];

    const cityCounts: Record<string, number> = {};
    profiles.forEach(profile => {
      cityCounts[profile.city] = (cityCounts[profile.city] || 0) + 1;
    });

    expect(cityCounts["Belo Horizonte"]).toBe(2);
    expect(cityCounts["São Paulo"]).toBe(1);
  });

  it("should filter profiles by selected city", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
      { id: 3, name: "Ana Costa", city: "Belo Horizonte", age: 22, body_type: "Magra" },
    ];

    const selectedCity = "Belo Horizonte";
    const filtered = profiles.filter(p => p.city === selectedCity);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].city).toBe("Belo Horizonte");
    expect(filtered[1].city).toBe("Belo Horizonte");
  });

  it("should return all profiles when 'Todas' is selected", () => {
    const profiles = [
      { id: 1, name: "Isabella Brito", city: "Belo Horizonte", age: 25, body_type: "Atlética" },
      { id: 2, name: "Maria Silva", city: "São Paulo", age: 30, body_type: "Curvilínea" },
    ];

    const selectedCity = "Todas";
    const filtered = selectedCity === "Todas" ? profiles : profiles.filter(p => p.city === selectedCity);

    expect(filtered).toHaveLength(2);
  });
});

describe("Seções Extras na Home", () => {
  it("should display correct number of profiles in Novidades section", () => {
    const profiles = [
      { id: 1, name: "Profile 1", city: "City 1", age: 25, body_type: "Type 1" },
      { id: 2, name: "Profile 2", city: "City 2", age: 26, body_type: "Type 2" },
      { id: 3, name: "Profile 3", city: "City 3", age: 27, body_type: "Type 3" },
      { id: 4, name: "Profile 4", city: "City 4", age: 28, body_type: "Type 4" },
      { id: 5, name: "Profile 5", city: "City 5", age: 29, body_type: "Type 5" },
      { id: 6, name: "Profile 6", city: "City 6", age: 30, body_type: "Type 6" },
    ];

    const novidadesProfiles = profiles.slice(0, 5);

    expect(novidadesProfiles).toHaveLength(5);
    expect(novidadesProfiles[0].id).toBe(1);
    expect(novidadesProfiles[4].id).toBe(5);
  });

  it("should display correct number of profiles in Mais Visitadas section", () => {
    const profiles = [
      { id: 1, name: "Profile 1", city: "City 1", age: 25, body_type: "Type 1" },
      { id: 2, name: "Profile 2", city: "City 2", age: 26, body_type: "Type 2" },
      { id: 3, name: "Profile 3", city: "City 3", age: 27, body_type: "Type 3" },
      { id: 4, name: "Profile 4", city: "City 4", age: 28, body_type: "Type 4" },
      { id: 5, name: "Profile 5", city: "City 5", age: 29, body_type: "Type 5" },
    ];

    const maisVisitadasProfiles = profiles.slice(0, 5);

    expect(maisVisitadasProfiles).toHaveLength(5);
  });

  it("should display correct number of profiles in Destaques section", () => {
    const profiles = [
      { id: 1, name: "Profile 1", city: "City 1", age: 25, body_type: "Type 1" },
      { id: 2, name: "Profile 2", city: "City 2", age: 26, body_type: "Type 2" },
      { id: 3, name: "Profile 3", city: "City 3", age: 27, body_type: "Type 3" },
    ];

    const destaquesProfiles = profiles.slice(0, 5);

    expect(destaquesProfiles.length).toBeLessThanOrEqual(5);
    expect(destaquesProfiles.length).toBe(3);
  });
});
