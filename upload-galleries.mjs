import { drizzle } from "drizzle-orm/mysql2";
import { photos } from "./drizzle/schema.js";
import * as dotenv from "dotenv";
import { storagePut } from "./server/storage.js";
import { readFileSync, readdirSync } from "fs";
import { nanoid } from "nanoid";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Mapeamento de arquivos para perfis
const profileMapping = {
  1: ["valentina-reis-2.png", "valentina-reis-3.png", "valentina-reis-4.png", "valentina-reis-5.png"],
  2: ["sofia-bardini-2.png", "sofia-bardini-3.png", "sofia-bardini-4.png", "sofia-bardini-5.png"],
  3: ["samara-2.png", "samara-3.png", "samara-4.png", "samara-5.png"],
  4: ["larissa-reis-2.png", "larissa-reis-3.png", "larissa-reis-4.png", "larissa-reis-5.png"],
  5: ["bruna-alencar-2.png", "bruna-alencar-3.png", "bruna-alencar-4.png", "bruna-alencar-5.png"],
  6: ["camille-laurent-2.png", "camille-laurent-3.png", "camille-laurent-4.png", "camille-laurent-5.png"],
  7: ["hanna-melo-2.png", "hanna-melo-3.png", "hanna-melo-4.png", "hanna-melo-5.png"],
  8: ["isabela-brito-2.png", "isabela-brito-3.png", "isabela-brito-4.png", "isabela-brito-5.png"],
};

async function uploadGalleries() {
  try {
    console.log("📸 Iniciando upload de galerias para S3...");

    for (const [profileId, filenames] of Object.entries(profileMapping)) {
      console.log(`\n📁 Processando perfil ${profileId}...`);
      
      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const filePath = `/home/ubuntu/farialover/generated-galleries/${filename}`;
        
        try {
          const fileBuffer = readFileSync(filePath);
          const randomSuffix = nanoid(10);
          const fileKey = `profiles/gallery/profile-${profileId}-${i + 2}-${randomSuffix}.png`;
          
          console.log(`  📤 Upload: ${filename}...`);
          const { url } = await storagePut(fileKey, fileBuffer, "image/png");
          
          console.log(`  ✅ URL: ${url}`);
          console.log(`  💾 Inserindo no banco...`);
          
          await db.insert(photos).values({
            profileId: parseInt(profileId),
            url: url,
            fileKey: fileKey,
            order: i + 2, // ordem 2, 3, 4, 5 (1 é a foto principal)
          });
          
          console.log(`  ✅ Foto ${i + 2} do perfil ${profileId} salva!`);
        } catch (error) {
          console.error(`  ❌ Erro ao processar ${filename}:`, error.message);
        }
      }
    }

    console.log("\n🎉 Todas as galerias foram carregadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro geral:", error);
    process.exit(1);
  }
}

uploadGalleries();
