import { supabase } from './supabaseClient';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (error) {
      console.error('Görsel yükleme hatası:', error.message);
      return null;
    }

    return fileName;
  } catch (err) {
    console.error('Hata:', err);
    return null;
  }
}
