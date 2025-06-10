'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name_tr: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  description_tr: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  price: number;
  category_id: string;
  image_url: string;
}

interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_de: string;
  name_ru: string;
}

function ProductContent() {
  const searchParams = useSearchParams();
  const selectedLanguage = searchParams.get('lang') || 'tr';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [nameTR, setNameTR] = useState('');
  const [nameEN, setNameEN] = useState('');
  const [nameDE, setNameDE] = useState('');
  const [nameRU, setNameRU] = useState('');
  const [descriptionTR, setDescriptionTR] = useState('');
  const [descriptionEN, setDescriptionEN] = useState('');
  const [descriptionDE, setDescriptionDE] = useState('');
  const [descriptionRU, setDescriptionRU] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name_tr: '',
    name_en: '',
    name_de: '',
    name_ru: '',
    description_tr: '',
    description_en: '',
    description_de: '',
    description_ru: '',
    price: '',
    category_id: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getTranslatedName = useCallback((item: Product | Category): string => {
    return selectedLanguage === 'en' ? item.name_en :
           selectedLanguage === 'de' ? item.name_de :
           selectedLanguage === 'ru' ? item.name_ru : item.name_tr;
  }, [selectedLanguage]);

  useEffect(() => {
    const filtered = products.filter((p) => {
      const name = getTranslatedName(p);
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedLanguage, getTranslatedName]);

  async function fetchData() {
    const { data: productData } = await supabase.from('products').select('*');
    const { data: categoryData } = await supabase.from('categories').select('*');
    setProducts(productData || []);
    setCategories(categoryData || []);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) return alert('Görsel yüklemelisin.');

    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, imageFile);

    if (uploadError) return alert('Görsel yüklenemedi.');

    const { error } = await supabase.from('products').insert({
      name_tr: nameTR,
      name_en: nameEN,
      name_de: nameDE,
      name_ru: nameRU,
      description_tr: descriptionTR,
      description_en: descriptionEN,
      description_de: descriptionDE,
      description_ru: descriptionRU,
      price: parseFloat(price),
      category_id: categoryId,
      image_url: fileName,
    });

    if (error) return alert('Ürün eklenirken hata oluştu.');

    setNameTR(''); setNameEN(''); setNameDE(''); setNameRU('');
    setDescriptionTR(''); setDescriptionEN(''); setDescriptionDE(''); setDescriptionRU('');
    setPrice('');
    setImageFile(null);
    setCategoryId('');
    fetchData();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return alert('Silme işlemi başarısız.');
    fetchData();
  }

  async function handleEditProduct(productId: string) {
    let newImageUrl = null;

    if (editData.imageFile) {
      const fileName = `${Date.now()}_${editData.imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, editData.imageFile);

      if (uploadError) return alert('Yeni görsel yüklenemedi.');
      newImageUrl = fileName;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name_tr: editData.name_tr,
        name_en: editData.name_en,
        name_de: editData.name_de,
        name_ru: editData.name_ru,
        description_tr: editData.description_tr,
        description_en: editData.description_en,
        description_de: editData.description_de,
        description_ru: editData.description_ru,
        price: parseFloat(editData.price),
        category_id: editData.category_id,
        ...(newImageUrl && { image_url: newImageUrl }),
      })
      .eq('id', productId);

    if (error) return alert('Güncelleme sırasında hata oluştu.');

    setEditingProductId(null);
    fetchData();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Ürün Yönetimi</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleAddProduct} className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Yeni Ürün Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input type="text" placeholder="Ad (TR)" value={nameTR} onChange={(e) => setNameTR(e.target.value)} className="input-style" />
            <input type="text" placeholder="Name (EN)" value={nameEN} onChange={(e) => setNameEN(e.target.value)} className="input-style" />
            <input type="text" placeholder="Name (DE)" value={nameDE} onChange={(e) => setNameDE(e.target.value)} className="input-style" />
            <input type="text" placeholder="Имя (RU)" value={nameRU} onChange={(e) => setNameRU(e.target.value)} className="input-style" />
            
            <textarea placeholder="Açıklama (TR)" value={descriptionTR} onChange={(e) => setDescriptionTR(e.target.value)} className="input-style h-20" rows={2}></textarea>
            <textarea placeholder="Description (EN)" value={descriptionEN} onChange={(e) => setDescriptionEN(e.target.value)} className="input-style h-20" rows={2}></textarea>
            <textarea placeholder="Beschreibung (DE)" value={descriptionDE} onChange={(e) => setDescriptionDE(e.target.value)} className="input-style h-20" rows={2}></textarea>
            <textarea placeholder="Описание (RU)" value={descriptionRU} onChange={(e) => setDescriptionRU(e.target.value)} className="input-style h-20" rows={2}></textarea>
            
            <input type="number" placeholder="Fiyat" value={price} onChange={(e) => setPrice(e.target.value)} className="input-style" />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-style">
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getTranslatedName(cat)}
                </option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="input-style md:col-span-2" />
          </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transform transition-all duration-300 hover:scale-105 font-semibold text-lg shadow-lg">
            Ürünü Ekle
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
              {p.image_url && (
                <div className="relative overflow-hidden">
                  <Image
                    src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/menu-images/${p.image_url}`}
                    alt={getTranslatedName(p)}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{getTranslatedName(p)}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₺{p.price}</span>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm rounded-full">
                    Ürün
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleDelete(p.id)} className="flex-1 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors duration-300 font-medium">
                    Sil
                  </button>
                  <button
                    onClick={() => {
                      setEditingProductId(p.id);
                      setEditData({
                        name_tr: p.name_tr || '',
                        name_en: p.name_en || '',
                        name_de: p.name_de || '',
                        name_ru: p.name_ru || '',
                        description_tr: p.description_tr || '',
                        description_en: p.description_en || '',
                        description_de: p.description_de || '',
                        description_ru: p.description_ru || '',
                        price: p.price.toString() || '',
                        category_id: p.category_id || '',
                        imageFile: null,
                      });
                    }}
                    className="flex-1 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg transition-colors duration-300 font-medium"
                  >
                    Düzenle
                  </button>
                </div>

                {editingProductId === p.id && (
                  <div className="mt-6 space-y-4 border-t pt-6">
                    <input type="text" placeholder="TR" value={editData.name_tr || ''} onChange={(e) => setEditData({ ...editData, name_tr: e.target.value })} className="input-style" />
                    <input type="text" placeholder="EN" value={editData.name_en || ''} onChange={(e) => setEditData({ ...editData, name_en: e.target.value })} className="input-style" />
                    <input type="text" placeholder="DE" value={editData.name_de || ''} onChange={(e) => setEditData({ ...editData, name_de: e.target.value })} className="input-style" />
                    <input type="text" placeholder="RU" value={editData.name_ru || ''} onChange={(e) => setEditData({ ...editData, name_ru: e.target.value })} className="input-style" />
                    <textarea placeholder="Description (TR)" value={editData.description_tr || ''} onChange={(e) => setEditData({ ...editData, description_tr: e.target.value })} className="input-style h-20" rows={2}></textarea>
                    <textarea placeholder="Description (EN)" value={editData.description_en || ''} onChange={(e) => setEditData({ ...editData, description_en: e.target.value })} className="input-style h-20" rows={2}></textarea>
                    <textarea placeholder="Description (DE)" value={editData.description_de || ''} onChange={(e) => setEditData({ ...editData, description_de: e.target.value })} className="input-style h-20" rows={2}></textarea>
                    <textarea placeholder="Description (RU)" value={editData.description_ru || ''} onChange={(e) => setEditData({ ...editData, description_ru: e.target.value })} className="input-style h-20" rows={2}></textarea>
                    <input type="number" value={editData.price || ''} onChange={(e) => setEditData({ ...editData, price: e.target.value })} className="input-style" />
                    <select value={editData.category_id || ''} onChange={(e) => setEditData({ ...editData, category_id: e.target.value })} className="input-style">
                      <option value="">Kategori Seç</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{getTranslatedName(cat)}</option>
                      ))}
                    </select>
                    <input type="file" accept="image/*" onChange={(e) => setEditData({ ...editData, imageFile: e.target.files?.[0] || null })} className="input-style" />
                    <button onClick={() => handleEditProduct(p.id)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium">
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

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
}
