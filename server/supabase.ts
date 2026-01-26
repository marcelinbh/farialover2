import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esbvidtmnlfduagkdoei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnZpZHRtbmxmZHVhZ2tkb2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjAzNTAsImV4cCI6MjA4NTAzNjM1MH0.WjIyJ2YM4_Tic0pX3ULEdz3CqGO1450RIIMhC2hCxRw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FilterOptions {
  name?: string;
  city?: string;
  minAge?: number;
  maxAge?: number;
  hairColor?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function searchProfiles(filters: FilterOptions = {}) {
  let query = supabase.from('profiles').select('*');

  // Filtro por nome (case-insensitive)
  if (filters.name) {
    query = query.ilike('name', `%${filters.name}%`);
  }

  // Filtro por cidade
  if (filters.city && filters.city !== 'all') {
    query = query.eq('city', filters.city);
  }

  // Filtro por idade
  if (filters.minAge) {
    query = query.gte('age', filters.minAge);
  }
  if (filters.maxAge) {
    query = query.lte('age', filters.maxAge);
  }

  // Filtro por cor de cabelo
  if (filters.hairColor && filters.hairColor !== 'all') {
    query = query.eq('hair_color', filters.hairColor);
  }

  // Filtro por tipo de corpo
  if (filters.bodyType && filters.bodyType !== 'all') {
    query = query.eq('body_type', filters.bodyType);
  }

  // Filtro por preço
  if (filters.minPrice) {
    query = query.gte('price_per_hour', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price_per_hour', filters.maxPrice);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar perfis:', error);
    throw error;
  }

  return data;
}

export async function getProfilePhotos(profileId: number) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('profile_id', profileId)
    .order('is_primary', { ascending: false });

  if (error) {
    console.error('Erro ao buscar fotos:', error);
    throw error;
  }

  return data;
}
