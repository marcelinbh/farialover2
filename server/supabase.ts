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

export type Video = {
  url: string;
  thumbnail: string;
  title: string;
};

export type Comment = {
  id: string;
  profile_id: number;
  author_name: string;
  comment_text: string;
  created_at: string;
  approved: boolean;
};

export type ProfileWithPhotos = Profile & {
  photos: Photo[];
  videos?: Video[];
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

export async function getCommentsByProfile(profileId: number): Promise<Comment[]> {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('profile_id', profileId)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }

  return comments || [];
}

export async function createComment(
  profileId: number,
  authorName: string,
  commentText: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      profile_id: profileId,
      author_name: authorName,
      comment_text: commentText,
      approved: false, // Comentários precisam ser aprovados
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

  return data;
}

export async function incrementProfileAccessCount(profileId: number): Promise<{ success: boolean }> {
  // Primeiro, buscar o valor atual
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('access_count')
    .eq('id', profileId)
    .single();

  if (fetchError) {
    console.error('Error fetching profile access count:', fetchError);
    return { success: false };
  }

  const currentCount = profile?.access_count || 0;

  // Atualizar com o novo valor
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ access_count: currentCount + 1 })
    .eq('id', profileId);

  if (updateError) {
    console.error('Error incrementing profile access count:', updateError);
    return { success: false };
  }

  return { success: true };
}

// Admin functions

export async function getAllComments(): Promise<Comment[]> {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all comments:', error);
    throw error;
  }

  return comments || [];
}

export async function approveComment(commentId: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('comments')
    .update({ approved: true })
    .eq('id', commentId);

  if (error) {
    console.error('Error approving comment:', error);
    return { success: false };
  }

  return { success: true };
}

export async function deleteComment(commentId: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    return { success: false };
  }

  return { success: true };
}

export async function getAdminStats(): Promise<{
  totalProfiles: number;
  totalComments: number;
  pendingComments: number;
  totalViews: number;
}> {
  // Total de perfis
  const { count: totalProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (profilesError) {
    console.error('Error fetching profiles count:', profilesError);
  }

  // Total de comentários
  const { count: totalComments, error: commentsError } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true });

  if (commentsError) {
    console.error('Error fetching comments count:', commentsError);
  }

  // Comentários pendentes
  const { count: pendingComments, error: pendingError } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('approved', false);

  if (pendingError) {
    console.error('Error fetching pending comments count:', pendingError);
  }

  // Total de visualizações (soma de access_count)
  const { data: profiles, error: viewsError } = await supabase
    .from('profiles')
    .select('access_count');

  let totalViews = 0;
  if (!viewsError && profiles) {
    totalViews = profiles.reduce((sum, profile) => sum + (profile.access_count || 0), 0);
  }

  return {
    totalProfiles: totalProfiles || 0,
    totalComments: totalComments || 0,
    pendingComments: pendingComments || 0,
    totalViews,
  };
}
