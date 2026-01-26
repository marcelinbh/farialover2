import { drizzle } from "drizzle-orm/mysql2";
import { photos, profiles } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// URLs de fotos de exemplo (usando placeholder)
const getPhotoUrls = (profileId) => {
  const baseUrl = "https://picsum.photos/seed";
  return [
    `${baseUrl}/profile${profileId}-1/600/800`,
    `${baseUrl}/profile${profileId}-2/600/800`,
    `${baseUrl}/profile${profileId}-3/600/800`,
    `${baseUrl}/profile${profileId}-4/600/800`,
  ];
};

async function seedPhotos() {
  console.log("🌱 Populando fotos adicionais...");

  try {
    // Buscar todos os perfis
    const allProfiles = await db.select().from(profiles);
    console.log(`📸 Encontrados ${allProfiles.length} perfis`);

    for (const profile of allProfiles) {
      const photoUrls = getPhotoUrls(profile.id);
      
      // Adicionar 4 fotos para cada perfil
      for (let i = 0; i < photoUrls.length; i++) {
        await db.insert(photos).values({
          profileId: profile.id,
          url: photoUrls[i],
          fileKey: `profiles/${profile.id}/story-${i + 1}`,
          order: i,
        });
      }

      console.log(`✅ Adicionadas 4 fotos para ${profile.name} (ID: ${profile.id})`);
    }

    console.log("🎉 Fotos populadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao popular fotos:", error);
    process.exit(1);
  }
}

seedPhotos();
