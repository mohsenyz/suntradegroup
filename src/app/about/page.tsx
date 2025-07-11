import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompanyOverview from '@/components/CompanyOverview';

export const metadata: Metadata = {
  title: 'درباره ما - سان ترد گروپ',
  description: 'آشنایی با سان ترد گروپ، تاریخچه بیش از ۲۵ ساله در زمینه ابزار و یراق آلات',
  keywords: 'درباره ما، سان ترد گروپ، ابزار، یراق آلات، تولید، توزیع'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <div className="bg-gradient-to-r from-golden-100 to-secondary-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              درباره سان ترد گروپ
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              با بیش از ربع قرن فعالیت و کسب تجربه در زمینه تولید و توزیع ابزار و یراق آلات در سطح کشور، 
              اکنون با حصول بالاترین کیفیت و تضمین محصولات، جزء برترین شرکت‌ها محسوب می‌شود
            </p>
          </div>
        </div>

        <CompanyOverview />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
                تاریخچه ما
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    شروع مسیر (حدود ۲۵ سال پیش)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    برند سان با هدف تولید و توزیع ابزار و یراق آلات باکیفیت در سطح کشور آغاز به کار کرد.
                    از همان ابتدا، تمرکز ما بر حصول بالاترین کیفیت و تضمین محصولات بوده است.
                  </p>
                </div>

                <div className="bg-golden-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    گسترش فعالیت‌ها و تضمین کیفیت
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    با گذشت زمان و کسب تجربه بیشتر، شبکه توزیع خود را به سراسر کشور گسترش دادیم و 
                    همراه با تضمین محصولات خود، اعتماد مشتریان را جلب کردیم.
                  </p>
                </div>

                <div className="bg-secondary-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    وضعیت کنونی و آینده
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    امروزه گروه بازرگانی سان ترد گروپ، آماده همکاری و ارائه محصولات خود به عمده فروشان و 
                    پخش کنندگان محترم ابزار و همچنین انبوه سازان محترم در سراسر کشور می‌باشد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
              چرا سان ترد گروپ؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-golden-500 to-secondary-600 flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">کیفیت تضمین شده</h3>
                <p className="text-gray-600 text-sm">تمامی محصولات دارای گارانتی کیفیت</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-golden-500 to-secondary-600 flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">ارسال سریع</h3>
                <p className="text-gray-600 text-sm">ارسال به سراسر کشور در کمترین زمان</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-golden-500 to-secondary-600 flex items-center justify-center">
                  <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">خدمات پس از فروش</h3>
                <p className="text-gray-600 text-sm">پشتیبانی کامل پس از خرید</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-golden-500 to-secondary-600 flex items-center justify-center">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">قیمت مناسب</h3>
                <p className="text-gray-600 text-sm">بهترین قیمت در بازار</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}