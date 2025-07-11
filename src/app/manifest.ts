import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'گروه تجاری آفتاب',
    short_name: 'آفتاب',
    description: 'تولیدکننده و تامین‌کننده انواع محصولات باکیفیت ایرانی',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    lang: 'fa',
    dir: 'rtl',
  };
}