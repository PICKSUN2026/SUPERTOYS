'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { addToCart, getProduct } from '@/lib/db'
import type { Product } from '@/types'
import { ShoppingCart, Minus, Plus, Truck, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id ? decodeURIComponent(params.id as string) : ''
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (productId) {
      getProduct(productId).then(p => {
        setProduct(p || null)
        setLoading(false)
      })
    }
  }, [productId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <p className="text-[15px] text-[var(--text-secondary)]">加载中...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <p className="text-[15px] text-[var(--text-secondary)]">商品不存在</p>
        <Link href="/products" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
          返回商品列表
        </Link>
      </div>
    )
  }

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    })
    setAdded(true)
    window.dispatchEvent(new Event('cart-updated'))
    setTimeout(() => setAdded(false), 2000)
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl]
  const shipping = product.shipping || 0

  return (
    <div className="max-w-7xl mx-auto px-5 py-6">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Left: Images */}
        <div className="flex flex-col">
          <div className="relative aspect-[4/3] bg-[var(--surface)] border border-[var(--border-light)] overflow-hidden mb-3">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-14 shrink-0 border-2 overflow-hidden transition-all ${
                    i === selectedImage ? 'border-[var(--accent)]' : 'border-[var(--border-light)] hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-tight">{product.name}</h1>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-1">{product.category}</p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--accent)]">${product.price.toFixed(2)}</span>
            {shipping > 0 && (
              <span className="text-[12px] text-[var(--text-tertiary)]">+ 运费 ${shipping.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-3 text-[12px] text-[var(--text-tertiary)]">
            {product.stock > 0 ? (
              <span>库存 {product.stock} 件</span>
            ) : (
              <span className="text-[var(--accent)]">暂时缺货</span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-[13px] font-medium text-[var(--foreground)]">数量</span>
            <div className="flex items-center border border-[var(--border)]">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-[14px]"><Minus size={14} /></button>
              <span className="w-10 text-center text-[14px] font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-[14px]"><Plus size={14} /></button>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button className="w-full bg-[var(--accent)] text-white py-3 text-[14px] font-bold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
              onClick={() => {
                if (!localStorage.getItem('currentUser')) { router.push('/login'); return }
                handleAddToCart()
              }} disabled={product.stock <= 0}>
              {added ? '✅ 已添加' : <span className="flex items-center justify-center gap-2"><ShoppingCart size={15} />加入购物车</span>}
            </button>
            <button className="w-full border-2 border-[var(--accent)] text-[var(--accent)] py-3 text-[14px] font-bold hover:bg-[var(--accent)]/5 transition-all disabled:opacity-50"
              onClick={() => {
                if (!localStorage.getItem('currentUser')) { router.push('/login'); return }
                handleAddToCart()
                setTimeout(() => router.push('/checkout'), 300)
              }} disabled={product.stock <= 0}>
              立即购买
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
            <Truck size={14} />
            <span>预计 3-7 个工作日送达</span>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-light)]">
            <p className="text-[13px] font-medium text-[var(--text-secondary)] mb-3">接受付款方式</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-white border border-[var(--border-light)] p-2.5 flex items-center justify-center">
                <img src="/assets/images/payments/Paypal-Logo-2022.png" alt="PayPal" className="h-8" />
              </div>
              <div className="bg-white border border-[var(--border-light)] p-2.5 flex items-center justify-center">
                <img src="/assets/images/payments/VISA-logo.jpg" alt="Visa" className="h-8" />
              </div>
              <div className="bg-white border border-[var(--border-light)] p-2.5 flex items-center justify-center">
                <img src="/assets/images/payments/Google-Pay-Logo-2018.png" alt="Google Pay" className="h-8" />
              </div>
              <div className="bg-white border border-[var(--border-light)] p-2.5 flex items-center justify-center">
                <img src="/assets/images/payments/Shop-Pay-Logo.jpg" alt="Shop Pay" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
