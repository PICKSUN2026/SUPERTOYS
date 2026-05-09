'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { getAllProducts } from '@/lib/db'
import type { Product } from '@/types'
import { ArrowRight, Shield, Truck, RotateCcw, BadgePercent, ChevronLeft, ChevronRight } from 'lucide-react'

const bannerImages = [
  '/assets/images/banner/LEGO_SanDiegoLEGOCon.jpg',
  '/assets/images/banner/Mattel-Booth_SDCC-2019_4-EMBED-2022.jpg',
  '/assets/images/banner/sdcc-2019-thursday-cosplay-group-1.jpg',
]

const brandImages = Array.from({ length: 17 }, (_, i) => {
  const name = i === 0 ? 'original.jpg' : `original (${i}).webp`
  return `/assets/images/brands/${name}`
})

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  const nextBanner = useCallback(() => {
    setCurrentBanner(prev => (prev + 1) % bannerImages.length)
  }, [])

  const prevBanner = useCallback(() => {
    setCurrentBanner(prev => (prev - 1 + bannerImages.length) % bannerImages.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextBanner, 5000)
    return () => clearInterval(timer)
  }, [nextBanner])

  return (
    <div>
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden bg-[#1d1d1f]">
        <div className="relative w-full h-[320px] md:h-[420px]">
          {bannerImages.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={src}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ))}
          {/* Arrows */}
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all z-10"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all z-10"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {bannerImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentBanner ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Promises */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Shield, title: '品质保证', desc: '精选正品 值得信赖' },
              { icon: Truck, title: '快速发货', desc: '72小时内发货' },
              { icon: RotateCcw, title: '90天退换', desc: '无忧购物体验' },
              { icon: BadgePercent, title: '超值低价', desc: '全网比价保障' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-4 bg-[#f5f5f7] rounded-2xl border border-[var(--border)]">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-3">
                  <item.icon size={20} className="text-[var(--accent)]" strokeWidth={1.5} />
                </div>
                <span className="text-[13px] font-semibold text-[var(--foreground)]">{item.title}</span>
                <span className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center mb-10">
            <div className="w-1 h-6 bg-gradient-to-b from-[var(--accent)] to-purple-500 mr-3" />
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent tracking-tight">玩具品牌</h2>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">精选全球热门 IP 玩具品牌</p>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {brandImages.slice(0, 18).map((src, i) => (
              <div key={i} className="aspect-square bg-[#f5f5f7] rounded-xl border border-[var(--border)] p-4 flex items-center justify-center hover:border-[var(--accent)]/30 hover:bg-white transition-all duration-300">
                <img src={src} alt={`品牌 ${i + 1}`} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
            ))}
            {/* More Brands */}
            <div className="aspect-square bg-gradient-to-br from-[var(--accent)]/5 to-purple-500/5 rounded-xl border border-dashed border-[var(--accent)]/30 p-4 flex flex-col items-center justify-center hover:border-[var(--accent)]/60 hover:from-[var(--accent)]/10 hover:to-purple-500/10 transition-all duration-300 cursor-pointer group">
              <span className="text-2xl font-light text-[var(--accent)]/50 group-hover:text-[var(--accent)]/80 transition-colors">+</span>
              <span className="text-[11px] text-[var(--text-tertiary)] mt-1 group-hover:text-[var(--accent)] transition-colors">更多品牌</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-[#f5f5f7] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-5 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[var(--accent)] to-purple-500 mr-3" />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent tracking-tight">新品上架</h2>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">最新到货人气商品</p>
              </div>
            </div>
            <Link href="/products" className="text-[13px] text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium flex items-center gap-1 transition-colors">
              查看全部 <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.slice(0, 10).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
