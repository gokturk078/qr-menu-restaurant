'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LogoHeader from '@/components/LogoHeader';
import Image from 'next/image';

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
  image_url: string;
  category_id: string;
}

interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  image_url?: string;
}

function CategoryContent({ categoryId }: { categoryId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'tr';

  const fetchData = useCallback(async () => {
    const [productsResponse, categoryResponse] = await Promise.all([
      supabase.from('products').select('*').eq('category_id', categoryId),
      supabase.from('categories').select('*').eq('id', categoryId).single()
    ]);

    if (productsResponse.data) setProducts(productsResponse.data);
    if (categoryResponse.data) setCategory(categoryResponse.data);
    setLoading(false);
  }, [categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LogoHeader />
      
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="mb-6 text-center">
          <button
            onClick={() => router.back()}
            className="bg-white hover:bg-gray-50 px-3 py-2 md:px-4 md:py-2 rounded-full shadow-md text-gray-700 mb-4 transition-colors text-sm md:text-base"
          >
            ← Geri
          </button>
          
          {category && (
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
              {getName(category)}
            </h1>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {product.image_url && (
                <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Image
                    src={`https://qpukvgruzanjhjwgcmlp.supabase.co/storage/v1/object/public/menu-images/${product.image_url}`}
                    alt={getName(product)}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4 md:p-6">
                <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                  {getName(product)}
                </h3>
                
                {getDescription(product) && (
                  <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm leading-relaxed">
                    {getDescription(product)}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-lg md:text-2xl font-bold text-blue-600">
                    ₺{product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <div className="text-gray-500 text-base md:text-lg">
              Bu kategoride henüz ürün bulunmuyor.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPageClient({ categoryId }: { categoryId: string }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    }>
      <CategoryContent categoryId={categoryId} />
    </Suspense>
  );
} 