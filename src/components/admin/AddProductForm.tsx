'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddProductForm({ onProductAdded }: { onProductAdded: () => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
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
    if (!formData.name || !formData.price || !formData.category_id || !imageFile) {
      alert('Lütfen tüm alanları doldurun ve görsel seçin.');
      return;
    }

    const imageName = await handleImageUpload();
    if (!imageName) return;

    const { error } = await supabase.from('products').insert([{
      ...formData,
      price: parseFloat(formData.price),
      image_url: imageName,
    }]);

    if (error) {
      alert('Ürün eklenemedi.');
      console.error(error);
    } else {
      alert('Ürün başarıyla eklendi.');
      setFormData({ name: '', description: '', price: '', category_id: '' });
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
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Açıklama"
        className="w-full border p-2"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Fiyat"
        className="w-full border p-2"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
        value={formData.category_id}
        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
      >
        <option value="">Kategori Seçin</option>
        {categories.map((cat: any) => (
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
