'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Şu anda auth kontrolü yapılmayacaksa, direkt yönlendiriyoruz:
    router.replace('/admin/dashboard');

    // Eğer kullanıcı kontrolü yapılacaksa buraya ekleyeceğiz:
    /*
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/unauthorized');
      }
    };
    checkAccess();
    */
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center text-lg text-gray-600">
      Yönlendiriliyorsunuz...
    </div>
  );
}
