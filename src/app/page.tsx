'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LogoHeader from '@/components/LogoHeader';

export default function HomePage() {
  const router = useRouter();

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleSelect = (lang: string) => {
    router.push(`/menu?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="pt-8 md:pt-12 pb-6 md:pb-8">
        <LogoHeader title="XXX Restoranı" />
      </div>

      {/* Main Content */}
      <main className="px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
              Dil Seçimi
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Lütfen dilini seçin / Please select your language
            </p>
          </div>

          {/* Language Selection Grid */}
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {languages.map((lang) => (
              <a
                key={lang.code}
                href={`/menu?lang=${lang.code}`}
                className="group bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-100 min-h-[64px] flex items-center"
              >
                <div className="flex items-center justify-center w-full">
                  <span className="text-3xl md:text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {lang.flag}
                  </span>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {lang.name}
                    </h3>
                  </div>
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8 md:mt-12 pb-8">
            <p className="text-xs md:text-sm text-gray-500">
              QR Menü • XXX Restoranı
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
