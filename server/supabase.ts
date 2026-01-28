import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://esbvidtmnlfduagkdoei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnZpZHRtbmxmZHVhZ2tkb2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjAzNTAsImV4cCI6MjA4NTAzNjM1MH0.WjIyJ2YM4_Tic0pX3ULEdz3CqGO1450RIIMhC2hCxRw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Profile = {
  id: number;
  name: string;
  age: number;
  height: string | null;
  weight: string | null;
  city: string;
  neighborhood: string | null;
  phone: string;
  whatsapp: string | null;
  bio: string | null;
  price_per_hour: number | null;
  hair_color: string | null;
  eye_color: string | null;
  body_type: string | null;
  breast_type: string | null;
  tattoo: boolean | null;
  piercing: boolean | null;
  zodiac_sign: string | null;
  services: string[] | null;
  languages: string[] | null;
  avatar_url: string | null;
  is_verified: boolean | null;
  is_premium: boolean | null;
  created_at: string;
  updated_at: string;
  highlight_tag: string | null;
};

export type Photo = {
  id: number;
  profile_id: number;
  url: string;
  is_primary: boolean | null;
  created_at: string;
};

export type ProfileWithPhotos = Profile & {
  photos: Photo[];
};

export async function getAllProfiles(): Promise<ProfileWithPhotos[]> {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: true });

  if (photosError) {
    console.error('Error fetching photos:', photosError);
    throw photosError;
  }

  const profilesWithPhotos = profiles.map((profile) => ({
    ...profile,
    photos: photos?.filter((photo) => photo.profile_id === profile.id) || [],
  }));

  return profilesWithPhotos;
}
