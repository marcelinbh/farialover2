import { drizzle } from "drizzle-orm/mysql2";
import { profiles } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { storagePut } from "./server/storage.js";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const photoMapping = [
  { id: 1, filename: "valentina-reis.png" },
  { id: 2, filename: "sofia-bardini.png" },
  { id: 3, filename: "samara.png" },
  { id: 4, filename: "larissa-reis.png" },
  { id: 5, filename: "bruna-alencar.png" },
  { id: 6, filename: "camille-laurent.png" },
  { id: 7, filename: "hanna-melo.png" },
  { id: 8, filename: "isabela-brito.png" },
];

async function uploadPhotos() {
  try {
    console.log("📸 Iniciando upload de fotos para S3...");

    for (const mapping of photoMapping) {
      const filePath = `/home/ubuntu/farialover/generated-photos/${mapping.filename}`;
      
      try {
        const fileBuffer = readFileSync(filePath);
        const randomSuffix = nanoid(10);
        const fileKey = `profiles/profile-${mapping.id}-${randomSuffix}.png`;
        
        console.log(`📤 Fazendo upload de ${mapping.filename}...`);
        const { url } = await storagePut(fileKey, fileBuffer, "image/png");
        
        console.log(`✅ Upload concluído: ${url}`);
        console.log(`💾 Atualizando perfil ID ${mapping.id}...`);
        
        await db
          .update(profiles)
          .set({
            photoUrl: url,
            photoKey: fileKey,
          })
          .where(eq(profiles.id, mapping.id));
        
        console.log(`✅ Perfil ${mapping.id} atualizado!`);
      } catch (error) {
        console.error(`❌ Erro ao processar ${mapping.filename}:`, error.message);
      }
    }

    console.log("🎉 Todos os uploads concluídos!");
  } catch (error) {
    console.error("❌ Erro geral:", error);
    process.exit(1);
  }
}

uploadPhotos();
