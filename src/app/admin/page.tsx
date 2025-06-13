'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = 'admin-saf'; // Buradan değiştir

export default function AdminPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Eğer daha önce giriş yapıldıysa direkt yönlendir
    if (typeof window !== 'undefined') {
      const ok = localStorage.getItem('admin_ok');
      if (ok === '1') {
        router.replace('/admin/dashboard');
      } else {
        setChecking(false);
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      localStorage.setItem('admin_ok', '1');
      router.replace('/admin/dashboard');
    } else {
      setError('Şifre yanlış!');
    }
  };

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-600">
        Yönlendiriliyorsunuz...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xs space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Girişi</h1>
        <input
          type="password"
          placeholder="Şifre"
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
