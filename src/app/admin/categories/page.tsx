'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  image_url: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    name_de: '',
    name_ru: '',
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name_tr: '',
    name_en: '',
    name_de: '',
    name_ru: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) return alert('Görsel yüklemelisin.');

    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('category-images')
      .upload(fileName, imageFile);

    if (uploadError) return alert('Görsel yüklenemedi.');

    const { error } = await supabase.from('categories').insert({
      ...formData,
      image_url: fileName,
    });

    if (error) return alert('Kategori eklenirken hata oluştu.');

    setFormData({ name_tr: '', name_en: '', name_de: '', name_ru: '' });
    setImageFile(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return alert('Silme işlemi başarısız.');
    fetchData();
  }

  async function handleEditCategory(id: string) {
    let newImageUrl = null;

    if (editData.imageFile) {
      const fileName = `${Date.now()}_${editData.imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(fileName, editData.imageFile);

      if (uploadError) return alert('Yeni görsel yüklenemedi.');
      newImageUrl = fileName;
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name_tr: editData.name_tr,
        name_en: editData.name_en,
        name_de: editData.name_de,
        name_ru: editData.name_ru,
        ...(newImageUrl && { image_url: newImageUrl }),
      })
      .eq('id', id);

    if (error) return alert('Güncelleme sırasında hata oluştu.');

    setEditId(null);
    fetchData();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Kategori Yönetimi</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleAddCategory} className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Yeni Kategori Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input type="text" placeholder="Türkçe Ad" value={formData.name_tr} onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })} className="input-style" />
            <input type="text" placeholder="İngilizce Ad" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="input-style" />
            <input type="text" placeholder="Almanca Ad" value={formData.name_de} onChange={(e) => setFormData({ ...formData, name_de: e.target.value })} className="input-style" />
            <input type="text" placeholder="Rusça Ad" value={formData.name_ru} onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })} className="input-style" />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="input-style md:col-span-2 lg:col-span-4" />
          </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-300 hover:scale-105 font-semibold text-lg shadow-lg">
            Kategori Ekle
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
              <div className="relative overflow-hidden">
                <Image
                  src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/category-images/${cat.image_url}`}
                  alt={cat.name_tr || cat.name_en || cat.name_de || cat.name_ru || 'Kategori Görseli'}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{cat.name_tr}</h3>
                <div className="flex gap-3 mb-4">
                  <button onClick={() => handleDelete(cat.id)} className="flex-1 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors duration-300 font-medium">
                    Sil
                  </button>
                  <button onClick={() => {
                    setEditId(cat.id);
                    setEditData({
                      name_tr: cat.name_tr || '',
                      name_en: cat.name_en || '',
                      name_de: cat.name_de || '',
                      name_ru: cat.name_ru || '',
                      imageFile: null,
                    });
                  }} className="flex-1 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg transition-colors duration-300 font-medium">
                    Düzenle
                  </button>
                </div>

                {editId === cat.id && (
                  <div className="space-y-4 border-t pt-6">
                    <input type="text" placeholder='türkçe ad' value={editData.name_tr || ''} onChange={(e) => setEditData({ ...editData, name_tr: e.target.value })} className="input-style" />
                    <input type="text" placeholder='ingilizce ad' value={editData.name_en || ''} onChange={(e) => setEditData({ ...editData, name_en: e.target.value })} className="input-style" />
                    <input type="text" placeholder='almanca ad' value={editData.name_de || ''} onChange={(e) => setEditData({ ...editData, name_de: e.target.value })} className="input-style" />
                    <input type="text" placeholder='rusça ad' value={editData.name_ru || ''} onChange={(e) => setEditData({ ...editData, name_ru: e.target.value })} className="input-style" />
                    <input type="file" accept="image/*" onChange={(e) => setEditData({ ...editData, imageFile: e.target.files?.[0] || null })} className="input-style" />
                    <button onClick={() => handleEditCategory(cat.id)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium">
                      Güncelle
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .input-style {
            border: 2px solid #e5e7eb;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            width: 100%;
            transition: border-color 0.3s ease;
            background-color: #f9fafb;
          }
          .input-style:focus {
            outline: none;
            border-color: #3b82f6;
            background-color: white;
          }
        `}</style>
      </div>
    </main>
  );
}
