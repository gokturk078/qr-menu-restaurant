'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddCategoryForm({ onCategoryAdded }: { onCategoryAdded: () => void }) {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('tr');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const addCategory = async () => {
    if (!name.trim() || !imageFile) return alert("Tüm alanları doldurun.");

    setLoading(true);

    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('category-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      alert('Görsel yüklenemedi.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('categories').insert([{ name, language, image_url: fileName }]);
    setLoading(false);

    if (error) {
      alert('Kategori eklenirken hata oluştu.');
      console.error(error);
    } else {
      setName('');
      setLanguage('tr');
      setImageFile(null);
      onCategoryAdded();
    }
  };

  return (
    <div className="p-4 border rounded shadow-md mb-6">
      <h3 className="text-lg font-bold mb-3">Yeni Kategori Ekle</h3>
      <input
        type="text"
        placeholder="Kategori adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      >
        <option value="tr">Türkçe</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="ru">Русский</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={addCategory}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Ekleniyor...' : 'Kategori Ekle'}
      </button>
    </div>
  );
}
