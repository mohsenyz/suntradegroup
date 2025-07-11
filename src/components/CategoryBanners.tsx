import Image from 'next/image'
import Link from 'next/link'
import categoryBanners from '@/data/category-banners.json'

export default function CategoryBanners() {
  return (
    <div className="flex flex-row gap-x-2 md:gap-x-4 w-full p-1 overflow-x-auto">
      {categoryBanners.map((banner, index) => (
        <Link
          key={index}
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