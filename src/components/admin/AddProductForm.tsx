'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  language: string;
}

export default function AddProductForm({ onProductAdded }: { onProductAdded: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '', // uuid!
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data || []);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage.from('menu-images').upload(fileName, imageFile);
    if (error) {
      console.error('Görsel yükleme hatası:', error);
      return null;
    }
    return fileName;
  };

  const addProduct = async () => {
    if (!form.name || !form.price || !form.category_id || !imageFile) {
      alert('Lütfen tüm alanları doldurun ve görsel seçin.');
      return;
    }

    const imageName = await handleImageUpload();
    if (!imageName) return;

    const { error } = await supabase.from('products').insert([{
      ...form,
      price: parseFloat(form.price),
      image_url: imageName,
    }]);

    if (error) {
      alert('Ürün eklenemedi.');
      console.error(error);
    } else {
      alert('Ürün başarıyla eklendi.');
      setForm({ name: '', description: '', price: '', image_url: '', category_id: '' });
      setImageFile(null);
      onProductAdded();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Yeni Ürün Ekle</h2>
      <input
        type="text"
        placeholder="Ürün Adı"
        className="w-full border p-2"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Açıklama"
        className="w-full border p-2"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Fiyat"
        className="w-full border p-2"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        type="file"
        className="w-full border p-2"
        onChange={(e) => {
          if (e.target.files?.[0]) setImageFile(e.target.files[0]);
        }}
      />
      <select
        className="w-full border p-2"
        value={form.category_id}
        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
      >
        <option value="">Kategori Seçin</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name} ({cat.language})
          </option>
        ))}
      </select>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={addProduct}
      >
        Ürünü Ekle
      </button>
    </div>
  );
}
