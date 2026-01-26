import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { profiles, photos } from './drizzle/schema.ts';

// Supabase config
const supabaseUrl = 'https://esbvidtmnlfduagkdoei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnZpZHRtbmxmZHVhZ2tkb2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjAzNTAsImV4cCI6MjA4NTAzNjM1MH0.WjIyJ2YM4_Tic0pX3ULEdz3CqGO1450RIIMhC2hCxRw';
const supabase = createClient(supabaseUrl, supabaseKey);

// MySQL config (current database)
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

async function migrate() {
  try {
    console.log('🚀 Iniciando migração para Supabase...');

    // 1. Buscar todos os perfis do MySQL
    const mysqlProfiles = await connection.query('SELECT * FROM profiles');
    console.log(`📊 Encontrados ${mysqlProfiles[0].length} perfis no MySQL`);

    // 2. Inserir perfis no Supabase
    for (const profile of mysqlProfiles[0]) {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          name: profile.name,
          age: profile.age,
          height: profile.height,
          weight: profile.weight,
          city: profile.city,
          neighborhood: profile.neighborhood,
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          bio: profile.bio,
          price_per_hour: profile.pricePerHour,
          hair_color: profile.hairColor,
          eye_color: profile.eyeColor,
          body_type: profile.bodyType,
          breast_type: profile.breastType,
          tattoo: profile.tattoo === 1,
          piercing: profile.piercing === 1,
          zodiac_sign: profile.zodiacSign,
          services: profile.services ? JSON.parse(profile.services) : [],
          languages: profile.languages ? JSON.parse(profile.languages) : [],
          avatar_url: profile.avatarUrl,
          is_verified: profile.isVerified === 1,
          is_premium: profile.isPremium === 1,
        })
        .select();

      if (error) {
        console.error(`❌ Erro ao inserir perfil ${profile.name}:`, error);
      } else {
        console.log(`✅ Perfil ${profile.name} migrado com sucesso!`);

        // 3. Buscar fotos do perfil no MySQL
        const mysqlPhotos = await connection.query(
          'SELECT * FROM photos WHERE profileId = ?',
          [profile.id]
        );

        // 4. Inserir fotos no Supabase
        if (mysqlPhotos[0].length > 0) {
          for (const photo of mysqlPhotos[0]) {
            const { error: photoError } = await supabase
              .from('photos')
              .insert({
                profile_id: data[0].id,
                url: photo.url,
                is_primary: photo.isPrimary === 1,
              });

            if (photoError) {
              console.error(`❌ Erro ao inserir foto:`, photoError);
            }
          }
          console.log(`  📸 ${mysqlPhotos[0].length} fotos migradas`);
        }
      }
    }

    console.log('✅ Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await connection.end();
  }
}

migrate();
