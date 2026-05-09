'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, clearCart, createOrder } from '@/lib/db'
import type { CartItem } from '@/types'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [recipient, setRecipient] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      router.push('/login')
      return
    }
    const load = async () => {
      const items = await getCart()
      setCart(items)
      setLoaded(true)
    }
    load()
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async () => {
    if (!recipient || !phone || !address) return
    setSubmitting(true)

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const order = {
      id: orderId,
      items: [...cart],
      total,
      status: 'paid' as const,
      createdAt: new Date().toISOString(),
      shippingAddress: address,
      phone,
      recipient,
    }

    await createOrder(order)
    await clearCart()
    window.dispatchEvent(new Event('cart-updated'))
    router.push(`/payment?orderId=${orderId}`)
  }

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
        <p className="text-lg text-gray-400">没有待结算的商品</p>
        <Link href="/products" className="mt-4 inline-block text-sm text-gray-600 hover:text-gray-900 underline">
          去选购
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> 返回购物车
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">确认订单</h1>

      {/* Items */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-3">商品信息</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {cart.map(item => (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-400 mt-1">x{item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-3">收货信息</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">收件人</label>
            <input
              type="text"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="请输入收件人姓名"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">手机号</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">收货地址</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="请输入详细收货地址"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">合计</span>
          <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!recipient || !phone || !address || submitting}
          className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? '提交中...' : '提交订单'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
