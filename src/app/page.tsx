'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LanguageSelectionPage() {
  const router = useRouter();

  const languages = [
    { code: 'tr', image: '/flags/tr.png', alt: 'Türkçe' },
    { code: 'en', image: '/flags/en.png', alt: 'English' },
    { code: 'de', image: '/flags/de.png', alt: 'Deutsch' },
    { code: 'ru', image: '/flags/ru.png', alt: 'Русский' },
  ];

  const handleSelect = (lang: string) => {
    router.push(`/menu?lang=${lang}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dil Seçin</h1>
          <p className="text-gray-600 text-lg">Select Language</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 justify-center max-w-3xl mx-auto">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-400 transition-colors duration-300">
                  <Image
                    src={lang.image}
                    alt={lang.alt}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <p className="mt-5 text-sm md:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                {lang.alt}
              </p>
            </div>
          ))}
        </div>

        <div className="text-gray-500 text-sm mt-8">
          <p>Menüyü görüntülemek için bir dil seçin</p>
        </div>
      </div>
    </main>
  );
}
