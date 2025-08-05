'use client';

import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const heroSlides = [
    {
      id: 1,
      title: 'ابزار و یراق آلات',
      subtitle: 'بیش از ربع قرن تجربه در تولید و توزیع',
      description: 'با سان ترد گروپ، بالاترین کیفیت و تضمین محصولات را تجربه کنید',
      image: '/images/hero/slider-1.webp',
      cta: 'مشاهده محصولات',
      link: '/products'
    },
    // {
    //   id: 2,
    //   title: 'تنوع در انتخاب',
    //   subtitle: 'مجموعه‌ای گسترده از محصولات متنوع',
    //   description: 'از محصولات خانگی تا لوکس، همه چیز در یک مکان',
    //   image: '/images/hero/slide-2.jpg',
    //   cta: 'کاوش در برندها',
    //   link: '/brands'
    // },
    // {
    //   id: 3,
    //   title: 'کیفیت تضمین شده',
    //   subtitle: 'استانداردهای بین‌المللی کیفیت',
    //   description: 'تمامی محصولات دارای گارانتی کیفیت و خدمات پس از فروش',
    //   image: '/images/hero/slide-3.jpg',
    //   cta: 'درباره ما بیشتر بدانید',
    //   link: '/about'
    // }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    rtl: true
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      <Slider {...settings}>
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative h-[500px] md:h-[600px]" dir="rtl">
            <div className="relative h-[500px] md:h-[600px]" style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
          }}>
            <div 
              className="w-full h-full bg-cover bg-center relative hero-pattern"
              style={{
                backgroundImage: `linear-gradient(240deg, black, transparent)`,
                backgroundSize: 'cover',
              }}
            >
              <div className="absolute inset-0"></div>
              <div className="relative z-10 container mx-auto px-4 h-full flex items-center text-shadow-xs">
                <div className="max-w-2xl text-white animate-slide-up">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-4 text-golden-300">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-flex items-center btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all group"
                  >
                    {slide.cta}
                    <ChevronLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform ltr-flip" />
                  </Link>
                </div>
              </div>
            </div>
              
            </div>

          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;