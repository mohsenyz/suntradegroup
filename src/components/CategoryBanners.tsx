'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryBanner {
  id: number
  image: string
  category: string
  url: string
  alt: string
  display_order: number
  active: number
}

export default function CategoryBanners() {
  const [banners, setBanners] = useState<CategoryBanner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/category-banners')
        const result = await response.json()
        if (result.data) {
          setBanners(result.data)
        }
      } catch (error) {
        console.error('Failed to load category banners:', error)
        // Fallback to static data if API fails
        try {
          const staticBanners = [
            {
              id: 1,
              image: "/images/category-banners/tools-banner.webp",
              category: "بیل و کلنگ",
              url: "/categories/shovels-pickaxes",
              alt: "بیل و کلنگ",
              display_order: 1,
              active: 1
            },
            {
              id: 2,
              image: "/images/category-banners/samurai-saw-banner.webp",
              category: "میخ و اره",
              url: "/categories/nails-saws", 
              alt: "میخ و اره",
              display_order: 2,
              active: 1
            },
            {
              id: 3,
              image: "/images/category-banners/locks-banner.webp",
              category: "قفل و سیلندر",
              url: "/categories/locks-cylinders",
              alt: "قفل و سیلندر", 
              display_order: 3,
              active: 1
            },
            {
              id: 4,
              image: "/images/category-banners/wire-chain-banner.webp",
              category: "توری و زنجیر",
              url: "/categories/mesh-chains",
              alt: "توری و زنجیر",
              display_order: 4,
              active: 1
            }
          ]
          setBanners(staticBanners)
        } catch (fallbackError) {
          console.error('Failed to load fallback banners:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadBanners()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-row gap-x-2 md:gap-x-4 w-full p-1 overflow-x-auto">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex-grow w-full lgx:min-w-[30%] bg-gray-200 rounded-md animate-pulse"
            style={{ height: '400px' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-x-2 md:gap-x-4 w-full p-1 overflow-x-auto">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.url}
          className="flex-grow w-full lgx:min-w-[30%]"
        >
          <Image
            src={banner.image}
            alt={banner.alt}
            width={500}
            height={400}
            className="rounded-md w-full"
            loading="lazy"
          />
        </Link>
      ))}
    </div>
  )
}