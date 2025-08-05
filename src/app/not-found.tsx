import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center" dir="rtl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">۴۰۴</h1>
        <p className="text-gray-600 mb-8">صفحه مورد نظر یافت نشد</p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}