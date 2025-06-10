import Image from 'next/image';

interface LogoHeaderProps {
  title?: string;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
}

export default function LogoHeader({ 
  title = "XXX Restoranı", 
  size = 'small', 
  showTitle = true 
}: LogoHeaderProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20', 
    large: 'w-24 h-24'
  };

  const titleSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl md:text-4xl'
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Image
          src="/logo.png"
          alt="Restoran Logo"
          width={size === 'small' ? 64 : size === 'medium' ? 80 : 96}
          height={size === 'small' ? 64 : size === 'medium' ? 80 : 96}
          className={`${sizeClasses[size]} rounded-full shadow-lg object-cover border-4 border-white`}
        />
      </div>
      {showTitle && (
        <h1 className={`${titleSizes[size]} font-bold text-gray-800 text-center`}>
          {title}
        </h1>
      )}
    </div>
  );
} 