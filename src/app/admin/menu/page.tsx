'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
  image_url: string;
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const selectedLanguage = searchParams.get('lang') || 'tr';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: productsData } = await supabase.from('products').select('*');
    const { data: categoriesData } = await supabase.from('categories').select('*');
    if (productsData) setProducts(productsData);
    if (categoriesData) setCategories(categoriesData);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : [];

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        {selectedLanguage === 'en'
          ? 'Menu'
          : selectedLanguage === 'de'
          ? 'Speisekarte'
          : selectedLanguage === 'ru'
          ? 'Меню'
          : 'Menü'}
      </h1>

      {!selectedCategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="cursor-pointer text-center border rounded shadow hover:shadow-lg transition p-2 bg-white"
            >
              <Image
                src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/category-images/${cat.image_url}`}
                alt={cat.name}
                width={200}
                height={200}
                className="rounded object-cover w-full h-40 mx-auto"
              />
              <h2 className="mt-2 font-semibold text-lg">{cat.name}</h2>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && (
        <>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-4 mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {selectedLanguage === 'en'
              ? 'Back to Categories'
              : selectedLanguage === 'de'
              ? 'Zurück zu Kategorien'
              : selectedLanguage === 'ru'
              ? 'Назад к категориям'
              : 'Kategorilere Dön'}
          </button>

          <div className="grid gap-4">
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500">
                {selectedLanguage === 'en'
                  ? 'No products in this category.'
                  : selectedLanguage === 'de'
                  ? 'Keine Produkte in dieser Kategorie.'
                  : selectedLanguage === 'ru'
                  ? 'Нет товаров в этой категории.'
                  : 'Bu kategoride ürün bulunamadı.'}
              </p>
            )}

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 border rounded shadow-sm bg-white"
              >
                <Image
                  src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/menu-images/${product.image_url}`}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{product.name}</h2>
                </div>
                <p className="text-lg font-bold text-orange-600 whitespace-nowrap">
                  ₺{product.price}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
