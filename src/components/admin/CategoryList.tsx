'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function CategoryList({ refresh, searchTerm }: { refresh: boolean; searchTerm: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedLang, setEditedLang] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) {
      setCategories(data || []);
      setFilteredCategories(data || []);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setEditedName(cat.name);
    setEditedLang(cat.language);
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    let imageUrl = editingCategory.image_url;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        alert('Resim yüklenemedi.');
        console.error(uploadError.message);
        return;
      }

      imageUrl = fileName;
    }

    const { error } = await supabase
      .from('categories')
      .update({ name: editedName, language: editedLang, image_url: imageUrl })
      .eq('id', editingCategory.id);

    if (error) {
      alert('Kategori güncellenemedi.');
      console.error(error.message);
    } else {
      alert('Kategori başarıyla güncellendi.');
      setEditingCategory(null);
      setImageFile(null);
      fetchCategories();
    }
  };

  const handleDelete = async (cat: any) => {
    if (cat.image_url) {
      const { error: deleteImageError } = await supabase.storage
        .from('category-images')
        .remove([cat.image_url]);

      if (deleteImageError) {
        console.error('Görsel silinemedi:', deleteImageError.message);
      }
    }

    const { error: deleteCatError } = await supabase
      .from('categories')
      .delete()
      .eq('id', cat.id);

    if (deleteCatError) {
      alert('Kategori silinemedi.');
      console.error(deleteCatError.message);
    } else {
      alert('Kategori silindi.');
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kategoriler</h2>
      {filteredCategories.map((cat) => (
        <div key={cat.id} className="border p-3 rounded shadow text-center space-y-2">
          {editingCategory?.id === cat.id ? (
            <>
              <input
                className="border p-1 w-full"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <select
                className="border p-1 w-full"
                value={editedLang}
                onChange={(e) => setEditedLang(e.target.value)}
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
                className="border p-1 w-full"
              />
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-3 py-1 rounded w-full">
                Kaydet
              </button>
            </>
          ) : (
            <>
              {cat.image_url && (
                <Image
                  src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/category-images/${cat.image_url}`}
                  alt={cat.name}
                  width={150}
                  height={100}
                  className="mx-auto rounded"
                />
              )}
              <div className="font-semibold">{cat.name} ({cat.language})</div>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleEdit(cat)} className="text-blue-600">Düzenle</button>
                <button onClick={() => handleDelete(cat)} className="text-red-600">Sil</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
