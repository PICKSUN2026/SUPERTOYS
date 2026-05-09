'use client'

import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${encodeURIComponent(product.id)}`}
      className="group block bg-white border border-[var(--border)] overflow-hidden card-hover"
    >
      <div className="aspect-square overflow-hidden bg-[#f5f5f7] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      <div className="p-3.5">
        <h3 className="text-[13px] text-[var(--foreground)] line-clamp-2 leading-snug font-normal">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold text-[var(--foreground)]">${product.price}</span>
          <span className="text-[11px] text-[var(--text-tertiary)]">+ ${product.shipping || 0} 运费</span>
        </div>
      </div>
    </Link>
  )
}
