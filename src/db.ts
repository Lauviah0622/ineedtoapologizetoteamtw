import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.PUBLIC_URL;
const supabaseKey = import.meta.env.PUBLIC_KEY;

console.log({ supabaseUrl, supabaseKey });

const supabase = createClient(supabaseUrl, supabaseKey);

// todo 這個應該藏在 API 裡面
const createApology = (data: string) => {
  return supabase.from('apologies').upsert({ data }).select('id');
};

const getApology = (id: string) => {
  return supabase.from('apologies').select('data').eq('id', id);
};


// todo 這個應該藏在 API 裡面
const uploadImage = (file: Blob, filename: string) => {
  return supabase.storage.from('images').upload(`/public/${filename}`, file, {
    contentType: 'image/jpeg',
    upsert: true,
    cacheControl: 'max-age=31536000',
  });
};

const getImageUrl = (filename: string) => {
  return supabase.storage.from('images').getPublicUrl(`/public/${filename}`);
};

export { createApology, getApology, uploadImage, getImageUrl };
