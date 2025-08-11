'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { jsonApi } from '@/utils/apiClient';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'لطفاً تمام فیلدهای الزامی را پر کنید.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await jsonApi.submitContact({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      setSubmitStatus({
        type: 'success',
        message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.'
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: unknown) {
      let errorMessage = 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.';
      
      if (error instanceof Error) {
        // Handle specific error messages based on API response
        if (error.message.includes('Rate limit exceeded') || error.message.includes('Too many')) {
          errorMessage = '⏰ تعداد درخواست‌های شما بیش از حد مجاز است.\n\n🚫 حداکثر 5 پیام در هر ساعت قابل ارسال است.\n\n⏳ لطفاً تا یک ساعت دیگر صبر کنید و مجدداً تلاش کنید.';
        } else if (error.message.includes('Validation failed')) {
          errorMessage = '❌ اطلاعات وارد شده صحیح نیست:\n\n• نام باید حداقل 2 کاراکتر باشد\n• ایمیل باید معتبر باشد\n• پیام باید حداقل 10 کاراکتر باشد\n\nلطفاً اطلاعات را بررسی و مجدداً ارسال کنید.';
        } else if (error.message.includes('Invalid JSON') || error.message.includes('400')) {
          errorMessage = '❌ خطا در ارسال اطلاعات:\n\nلطفاً تمام فیلدهای الزامی را به درستی پر کنید و مجدداً تلاش کنید.';
        } else if (error.message.includes('500')) {
          errorMessage = '🔧 خطا در سرور:\n\nمشکل موقتی در سرور رخ داده است. لطفاً چند دقیقه دیگر مجدداً تلاش کنید.';
        } else if (error.message.includes('Cannot connect') || error.message.includes('fetch')) {
          errorMessage = '🌐 خطا در اتصال:\n\nامکان اتصال به سرور وجود ندارد. لطفاً اتصال اینترنت خود را بررسی کنید و مجدداً تلاش کنید.';
        }
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            تماس با ما
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ما آماده‌ایم تا به سوالات شما پاسخ دهیم و بهترین خدمات را ارائه کنیم
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              اطلاعات تماس
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-golden-500 to-secondary-600 rounded-full flex items-center justify-center ml-4">
                  <PhoneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">تلفن تماس</h3>
                  <p className="text-gray-600">۰۳۱-۳۳۳۶۳۴۵۸</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-golden-500 to-secondary-600 rounded-full flex items-center justify-center ml-4">
                  <EnvelopeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">ایمیل</h3>
                  <p className="text-gray-600">novin113@yahoo.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-golden-500 to-secondary-600 rounded-full flex items-center justify-center ml-4">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">آدرس فروشگاه</h3>
                  <p className="text-gray-600">
                    اصفهان، میدان جمهوری، خیابان امام خمینی،<br />
                    نبش کوچه ۱۳ (استوار)، فروشگاه سان
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-golden-500 to-secondary-600 rounded-full flex items-center justify-center ml-4">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">ساعات کاری</h3>
                  <p className="text-gray-600">شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰</p>
                  <p className="text-gray-600">پنج‌شنبه: ۸:۰۰ - ۱۳:۰۰</p>
                  <p className="text-gray-600">جمعه: تعطیل</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-golden-50 border border-golden-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-golden-800 mb-3">
                پاسخگویی سریع
              </h3>
              <p className="text-golden-700 mb-4">
                تیم پشتیبانی ما آماده است تا در کمترین زمان ممکن به درخواست‌های شما پاسخ دهد.
              </p>
              <p className="text-golden-700">
                <strong>زمان پاسخ:</strong> کمتر از ۲۴ ساعت در روزهای کاری
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              فرم تماس
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Message */}
              {submitStatus.type && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-sm ${
                    submitStatus.type === 'success' 
                      ? 'text-green-800' 
                      : 'text-red-800'
                  }`}>
                    {submitStatus.message.split('\n').map((line, index) => (
                      <div key={index} className={index > 0 ? 'mt-1' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    نام <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                    placeholder="نام خود را وارد کنید"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                    placeholder="نام خانوادگی خود را وارد کنید"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                  placeholder="ایمیل خود را وارد کنید"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                  placeholder="شماره تلفن خود را وارد کنید"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  موضوع
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="">موضوع را انتخاب کنید</option>
                  <option value="product-inquiry">استعلام محصول</option>
                  <option value="support">پشتیبانی</option>
                  <option value="complaint">شکایت</option>
                  <option value="suggestion">پیشنهاد</option>
                  <option value="cooperation">همکاری</option>
                  <option value="other">سایر موارد</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  پیام <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                  placeholder="پیام خود را اینجا بنویسید..."
                  required
                  disabled={isSubmitting}
                  minLength={10}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'btn-primary text-white hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                <span className="text-red-500">*</span> فیلدهای الزامی
              </p>

              {/* Rate Limiting Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      اطلاعات مهم درباره ارسال پیام
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• حداکثر 5 پیام در هر ساعت قابل ارسال است</p>
                      <p>• پاسخ به پیام‌ها معمولاً کمتر از 24 ساعت طول می‌کشد</p>
                      <p>• برای مسائل فوری می‌توانید با شماره تلفن تماس بگیرید</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            راه‌های دیگر ارتباط
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <a href="tel:+983133363458" className="block">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">تماس مستقیم</h3>
                <p className="text-gray-600">031-33363458</p>
              </a>
            </div>

            <div className="text-center">
              <a href="https://t.me/sungro" target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-blue-600 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">تلگرام</h3>
                <p className="text-gray-600">@sungro</p>
              </a>
            </div>

            <div className="text-center">
              <a href="https://wa.me/989398960220" target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-green-600 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">واتساپ</h3>
                <p className="text-gray-600">+98 939 896 0220</p>
              </a>
            </div>

            <div className="text-center">
              <a href="https://instagram.com/sun_tradegroup" target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">اینستاگرام</h3>
                <p className="text-gray-600">@sun_tradegroup</p>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}