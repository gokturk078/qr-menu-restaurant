'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  image_url?: string;
}

export default function CategoryList({ refresh, searchTerm }: { refresh: boolean; searchTerm: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Category>({
    id: '',
    name_tr: '',
    name_en: '',
    name_de: '',
    name_ru: '',
    image_url: ''
  });

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) {
      setCategories(data || []);
      setFilteredCategories(data || []);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm(category);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('categories')
      .update({
        name_tr: editForm.name_tr,
        name_en: editForm.name_en,
        name_de: editForm.name_de,
        name_ru: editForm.name_ru,
        image_url: editForm.image_url
      })
      .eq('id', editForm.id);

    if (error) {
      alert('Güncelleme başarısız.');
    } else {
      setEditingId(null);
      fetchCategories();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      id: '',
      name_tr: '',
      name_en: '',
      name_de: '',  
      name_ru: '',
      image_url: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      alert('Silme işlemi başarısız.');
    } else {
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name_tr.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kategoriler</h2>
      {filteredCategories.map((cat) => (
        <div key={cat.id} className="bg-white p-4 rounded-lg shadow">
          {editingId === cat.id ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Türkçe İsim"
                value={editForm.name_tr}
                onChange={(e) => setEditForm({ ...editForm, name_tr: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="English Name"
                value={editForm.name_en}
                onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Deutsche Name"
                value={editForm.name_de}
                onChange={(e) => setEditForm({ ...editForm, name_de: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Русское имя"
                value={editForm.name_ru}
                onChange={(e) => setEditForm({ ...editForm, name_ru: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Kaydet
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg">{cat.name_tr}</h3>
              <p className="text-sm text-gray-600">
                EN: {cat.name_en} | DE: {cat.name_de} | RU: {cat.name_ru}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
