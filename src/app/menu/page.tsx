'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import LogoHeader from '@/components/LogoHeader';

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
  image_url: string;
}

function MenuContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'tr';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: productData } = await supabase.from('products').select('*');
    const { data: categoryData } = await supabase.from('categories').select('*');
    if (productData) setProducts(productData);
    if (categoryData) setCategories(categoryData);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : [];

  const getName = (item: Product | Category) => {
    switch (lang) {
      case 'en':
        return item.name_en;
      case 'de':
        return item.name_de;
      case 'ru':
        return item.name_ru;
      case 'tr':
      default:
        return item.name_tr;
    }
  };

  const getDescription = (product: Product) => {
    switch (lang) {
      case 'en':
        return product.description_en;
      case 'de':
        return product.description_de;
      case 'ru':
        return product.description_ru;
      case 'tr':
      default:
        return product.description_tr;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <LogoHeader 
            title="XXX Restoranı" 
            size="small"
            showTitle={false}
          />
        </div>
      </nav>

      <main className="pt-6">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Menü</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          {!selectedCategory ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">Kategoriler</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/category-images/${cat.image_url}`}
                        alt={getName(cat)}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {getName(cat)}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 border border-gray-200"
                  onClick={() => setSelectedCategory(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kategorilere Dön
                </button>
                
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {categories.find(c => c.id === selectedCategory) ? 
                      getName(categories.find(c => c.id === selectedCategory)!) : 
                      'Kategori Bulunamadı'}
                  </h2>
                </div>
                <div className="w-32"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/menu-images/${product.image_url}`}
                        alt={getName(product)}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{getName(product)}</h3>
                      {getDescription(product) && (
                        <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical' as const 
                        }}>
                          {getDescription(product)}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">₺{product.price}</span>
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm rounded-full">
                          Menü
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
