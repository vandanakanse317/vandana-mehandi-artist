import { supabase } from './supabase';

const bucketStatusCache: Record<string, boolean> = {};

export async function getSupabaseImageUrl(bucket: string, path: string): Promise<string> {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  let finalUrl = publicUrlData.publicUrl;

  if (bucketStatusCache[bucket] === undefined) {
    try {
      const res = await fetch(finalUrl, { method: 'HEAD' });
      bucketStatusCache[bucket] = res.ok;
    } catch (e) {
      bucketStatusCache[bucket] = false;
    }
  }

  if (!bucketStatusCache[bucket]) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      finalUrl = data.signedUrl;
    }
  }

  return finalUrl;
}
