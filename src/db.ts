import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.URL
const supabaseKey = import.meta.env.KEY

const supabase = createClient(supabaseUrl, supabaseKey)


const createApology = (data: string, img: string) => {
  return supabase.from('apologies').upsert({ data, img }).select("id");
}

const getApology = (id: string) => {
  return supabase.from('apologies').select('img, data').eq('id', id);
}

export { createApology, getApology };




