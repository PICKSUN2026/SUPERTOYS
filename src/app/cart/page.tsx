'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCart, updateCartItem, clearCart } from '@/lib/db'
import type { CartItem } from '@/types'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      router.push('/login')
      return
    }
    loadCart()
  }, [])

  const loadCart = async () => {
    const items = await getCart()
    setCart(items)
    setLoaded(true)
  }

  const handleQuantity = async (productId: string, delta: number) => {
    const item = cart.find(i => i.productId === productId)
    if (!item) return
    const newQty = item.quantity + delta
    await updateCartItem(productId, newQty)
    window.dispatchEvent(new Event('cart-updated'))
    loadCart()
  }

  const handleRemove = async (productId: string) => {
    await updateCartItem(productId, 0)
    window.dispatchEvent(new Event('cart-updated'))
    loadCart()
  }

  const handleClear = async () => {
    await clearCart()
    window.dispatchEvent(new Event('cart-updated'))
    loadCart()
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-200" />
        <p className="mt-4 text-lg text-gray-400">购物车是空的</p>
        <Link href="/products" className="mt-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 underline">
          去逛逛 <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">购物车</h1>
        <button onClick={handleClear} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
          清空
        </button>
      </div>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <Link href={`/products/${item.productId}`} className="shrink-0">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.productId}`} className="text-sm font-medium text-gray-900 hover:underline line-clamp-1">
                {item.name}
              </Link>
              <p className="mt-1 text-sm font-bold text-gray-900">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantity(item.productId, -1)}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-400"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQuantity(item.productId, 1)}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-400"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="text-right min-w-[80px]">
              <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleRemove(item.productId)}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">合计</span>
          <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-blue-600 text-white text-center py-3 font-medium hover:bg-blue-700 transition-colors"
        >
          去结算
        </Link>
      </div>
    </div>
  )
}
