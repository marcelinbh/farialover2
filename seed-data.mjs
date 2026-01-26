import { drizzle } from "drizzle-orm/mysql2";
import { profiles, categories, profileCategories } from "./drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const categoriesData = [
  { name: "ALTO PADRÃO", slug: "alto-padrao", description: "Acompanhantes de alto nível", color: "#8B00FF" },
  { name: "VIP", slug: "vip", description: "Perfis VIP exclusivos", color: "#FF1493" },
  { name: "VÍDEO CHAMADA", slug: "video-chamada", description: "Atende por vídeo chamada", color: "#9D00FF" },
  { name: "DELICADA ATENCIOSA", slug: "delicada-atenciosa", description: "Atendimento delicado e atencioso", color: "#FF69B4" },
  { name: "ORAL INESQUECÍVEL", slug: "oral-inesquecivel", description: "Especialista em oral", color: "#8B00FF" },
  { name: "ANAL COMPLETO", slug: "anal-completo", description: "Atende anal completo", color: "#FF1493" },
  { name: "MASSAGEM SENSUAL", slug: "massagem-sensual", description: "Massagem sensual e relaxante", color: "#9D00FF" },
  { name: "LUXUOSA", slug: "luxuosa", description: "Acompanhante de luxo", color: "#FF69B4" },
  { name: "NOVINHA", slug: "novinha", description: "Jovem e linda", color: "#8B00FF" },
  { name: "EXPERIENTE", slug: "experiente", description: "Experiente e safada", color: "#FF1493" },
];

const profilesData = [
  {
    name: "Valentina Reis",
    age: 23,
    height: "1.68",
    weight: 55,
    phone: "(31) 99795-7228",
    city: "Belo Horizonte",
    region: "Savassi",
    description: "Olá, meu amor! Sou a Valentina, uma acompanhante de alto padrão que vai te proporcionar momentos inesquecíveis. Atendo em local discreto e com toda privacidade que você merece.",
    isVip: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Sofia Bardini",
    age: 21,
    height: "1.65",
    weight: 58,
    phone: "(31) 98215-0909",
    city: "Belo Horizonte",
    region: "Caiçara",
    description: "Sou a Sofia, uma morena linda e carinhosa. Adoro proporcionar prazer e momentos especiais. Venha me conhecer!",
    isVip: false,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Samara",
    age: 25,
    height: "1.74",
    weight: 65,
    phone: "(31) 97311-2247",
    city: "Belo Horizonte",
    region: "Carlos Prates",
    description: "Olá! Sou a Samara, loira, alta e muito gostosa. Faço vídeo chamada também! Me chama no WhatsApp.",
    isVip: false,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Larissa Reis",
    age: 24,
    height: "1.75",
    weight: 70,
    phone: "(31) 99166-2055",
    city: "Belo Horizonte",
    region: "Santo Antônio",
    description: "Morena jambo, alta e sensual. Adoro um bom papo e momentos intensos. Vem me conhecer!",
    isVip: true,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Bruna Alencar",
    age: 22,
    height: "1.55",
    weight: 48,
    phone: "(31) 99067-3167",
    city: "Belo Horizonte",
    region: "Funcionários",
    description: "Pequena, mas muito safada! Adoro anal sem restrições. Vem se divertir comigo!",
    isVip: false,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Camille Laurent",
    age: 26,
    height: "1.65",
    weight: 63,
    phone: "(31) 97154-2339",
    city: "Belo Horizonte",
    region: "Todas as Regiões",
    description: "Expert em anal! Atendo em todas as regiões de BH. Discreta e muito gostosa.",
    isVip: true,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Hanna Melo",
    age: 20,
    height: "1.63",
    weight: 50,
    phone: "(31) 99065-2121",
    city: "Belo Horizonte",
    region: "Santo Agostinho",
    description: "Novinha, linda e de alto nível. Proporciono a melhor experiência para você!",
    isVip: false,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Isabela Brito",
    age: 22,
    height: "1.72",
    weight: 52,
    phone: "(31) 99630-6565",
    city: "Belo Horizonte",
    region: "Sion",
    description: "Últimos dias em BH! Não perca a chance de me conhecer. Alta, magra e muito gostosa!",
    isVip: false,
    isFeatured: true,
    isActive: true,
  },
];

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Inserir categorias
    console.log("📝 Inserindo categorias...");
    for (const cat of categoriesData) {
      await db.insert(categories).values(cat).onDuplicateKeyUpdate({ set: { name: cat.name } });
    }
    console.log("✅ Categorias inseridas!");

    // Inserir perfis
    console.log("👤 Inserindo perfis...");
    for (const profile of profilesData) {
      const result = await db.insert(profiles).values(profile);
      const profileId = Number(result[0].insertId);
      
      // Adicionar categorias aleatórias aos perfis
      const randomCategories = categoriesData
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      for (const cat of randomCategories) {
        const categoryResult = await db.select().from(categories).where({ slug: cat.slug }).limit(1);
        if (categoryResult.length > 0) {
          await db.insert(profileCategories).values({
            profileId,
            categoryId: categoryResult[0].id,
          });
        }
      }
    }
    console.log("✅ Perfis inseridos!");

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seed();
