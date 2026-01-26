import { drizzle } from "drizzle-orm/mysql2";
import { profiles } from "./drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function updateVerification() {
  try {
    console.log("🔄 Atualizando status de verificação dos perfis...");

    // Marcar todos os perfis como verificados e com fotos reais
    // (você pode ajustar isso para marcar apenas perfis específicos)
    const result = await db.update(profiles).set({
      isVerified: true,
      hasRealPhotos: true,
    });

    console.log("✅ Todos os perfis foram marcados como verificados!");
    console.log("✅ Status atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar perfis:", error);
    process.exit(1);
  }
}

updateVerification();
