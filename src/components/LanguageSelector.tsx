'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
];

export default function LanguageSelector() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    setSelectedLang(lang);
    localStorage.setItem('lang', lang);
    router.refresh();
  };

  return (
    <div className="p-4 flex justify-center gap-4">
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`px-4 py-2 rounded ${selectedLang === lang.code ? 'bg-black text-white' : 'bg-gray-200'}`}
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
