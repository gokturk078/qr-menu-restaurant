# QR Menu Restaurant App 🍽️

Modern, çok dilli QR menü uygulaması - Next.js ve Supabase ile geliştirildi.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.8-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## ✨ Özellikler

- 🌍 **Çok Dilli Destek**: Türkçe, İngilizce, Almanca, Rusça
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu  
- 🎨 **Modern UI**: Gradient arka planlar ve smooth animasyonlar
- 👨‍💻 **Admin Paneli**: Kategori ve ürün yönetimi
- 🖼️ **Görsel Yönetimi**: Supabase Storage ile görsel yükleme
- 💾 **Gerçek Zamanlı Veritabanı**: Supabase PostgreSQL
- 🔒 **Güvenli**: Environment variables ile API güvenliği
- ⚡ **Hızlı**: Next.js optimizasyonları ve caching

## 🛠️ Teknolojiler

### Frontend
- **Framework**: Next.js 15.3.3
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4.1.8
- **Icons**: Heroicons (SVG)

### Backend & Database
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (Görsel dosyalar)
- **Authentication**: Supabase Auth (Gelecek sürümler için hazır)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier ready
- **Version Control**: Git

## 📱 Ekran Görüntüleri

### Dil Seçimi
Modern bayrak seçimi ile 4 dil desteği

### Menü Görünümü
- Kategori seçimi
- Ürün listesi ve detayları
- Responsive tasarım

### Admin Paneli
- Dashboard istatistikleri
- Kategori yönetimi
- Ürün yönetimi (CRUD işlemleri)

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### 1. Repository'yi Klonla
```bash
git clone https://github.com/gokturk078/qr-menu-restaurant.git
cd qr-menu-restaurant
```

### 2. Dependencies'i Yükle
```bash
npm install
```

### 3. Environment Variables'ı Ayarla
`.env.local` dosyası oluştur:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Veritabanını Kur
Supabase'de aşağıdaki tabloları oluştur:

#### Categories Tablosu
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tr TEXT,
  name_en TEXT,
  name_de TEXT,
  name_ru TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Products Tablosu
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tr TEXT,
  name_en TEXT,
  name_de TEXT,
  name_ru TEXT,
  description_tr TEXT,
  description_en TEXT,
  description_de TEXT,
  description_ru TEXT,
  price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Storage Bucket'larını Oluştur
Supabase Storage'da:
- `category-images`
- `menu-images`

### 6. Development Server'ı Başlat
```bash
npm run dev
```

http://localhost:3000 adresinde uygulamayı görüntüle.

## 📁 Proje Yapısı

```
qr-menu-restaurant/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin paneli sayfaları
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── categories/    # Kategori yönetimi
│   │   │   └── products/      # Ürün yönetimi
│   │   ├── menu/              # Müşteri menü sayfaları
│   │   └── page.tsx           # Ana sayfa (Dil seçimi)
│   ├── components/            # Reusable components
│   │   ├── admin/            # Admin-specific components
│   │   └── LogoHeader.tsx    # Ortak logo component
│   ├── lib/                  # Utility functions
│   │   └── supabaseClient.ts # Supabase konfigürasyonu
│   └── styles/               # CSS dosyaları
├── public/                   # Static assets
│   ├── flags/               # Bayrak görselleri
│   └── logo.png            # Restoran logosu
├── tailwind.config.ts       # Tailwind konfigürasyonu
├── next.config.ts          # Next.js konfigürasyonu
└── package.json
```

## 🎯 Kullanım

### Müşteri Akışı
1. **Dil Seçimi**: Ana sayfada bayrak seçerek dil belirleme
2. **Kategori Görünümü**: Menü kategorilerini görüntüleme
3. **Ürün Listesi**: Seçilen kategorideki ürünleri görüntüleme
4. **Ürün Detayları**: Fiyat ve açıklama bilgileri

### Admin Akışı
1. **Dashboard**: `/admin/dashboard` - Genel istatistikler
2. **Kategori Yönetimi**: `/admin/categories` - CRUD işlemleri
3. **Ürün Yönetimi**: `/admin/products` - CRUD işlemleri

## 🌐 Deployment

### Vercel (Önerilen)
1. GitHub repository'sini Vercel'e bağla
2. Environment variables'ı ayarla
3. Deploy et

### Diğer Platformlar
- Netlify
- Railway
- Heroku

## 🔧 Konfigürasyon

### Tailwind CSS v4
- Modern gradient arka planlar
- Responsive grid sistemleri
- Custom animations

### Next.js 15
- App Router kullanımı
- Image optimization
- Automatic code splitting

## 🤝 Katkıda Bulunma

1. Repository'yi fork et
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Değişikliklerini commit et (`git commit -m 'Add amazing feature'`)
4. Branch'ini push et (`git push origin feature/amazing-feature`)
5. Pull Request oluştur

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Göktürk** - [GitHub](https://github.com/gokturk078)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Heroicons](https://heroicons.com/) - SVG icons

---

⭐ Bu projeyi beğendiysen yıldız vermeyi unutma!
