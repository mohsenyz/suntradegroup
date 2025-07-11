import React from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  CheckBadgeIcon, 
  TrophyIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const CompanyOverview = () => {
  const stats = [
    {
      icon: UserGroupIcon,
      number: '10+',
      label: 'تیم متخصص',
      description: 'کارشناسان مجرب'
    },
    {
      icon: CheckBadgeIcon,
      number: '25+',
      label: 'سال تجربه',
      description: 'در ابزار و یراق آلات'
    },
    {
      icon: TrophyIcon,
      number: '1000+',
      label: 'مشتری راضی',
      description: 'در سراسر کشور'
    },
    {
      icon: SparklesIcon,
      number: '50+',
      label: 'محصول متنوع',
      description: 'در دسته‌های مختلف'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              سان ترد گروپ
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              پیشرو در تولید ابزار و یراق آلات
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              برند سان مفتخر است با بیش از ربع قرن فعالیت و کسب تجربه در زمینه تولید و توزیع ابزار و یراق آلات در سطح کشور، 
              اکنون با حصول بالاترین کیفیت و نیز همراه با تضمین محصولات خود، جزء برترین شرکت‌ها در زمینه ابزار و یراق محسوب شود.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              گروه بازرگانی سان ترد گروپ، آماده همکاری و ارائه محصولات خود به عمده فروشان و پخش کنندگان محترم ابزار و همچنین انبوه سازان محترم در سراسر کشور می‌باشد.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all text-center">
                تماس با ما
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-golden-600 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">رسالت ما</h4>
              <p className="text-gray-600 leading-relaxed">
                تولید و توزیع ابزار و یراق آلات باکیفیت با بالاترین استانداردها و تضمین کامل محصولات
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">چشم‌انداز ما</h4>
              <p className="text-gray-600 leading-relaxed">
                جزء برترین شرکت‌ها در زمینه ابزار و یراق آلات کشور و خدمت‌رسانی به عمده فروشان و انبوه سازان
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">ارزش‌های ما</h4>
              <p className="text-gray-600 leading-relaxed">
                کیفیت، صداقت، نوآوری و مسئولیت‌پذیری در تمامی فعالیت‌ها و ارائه خدمات
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;