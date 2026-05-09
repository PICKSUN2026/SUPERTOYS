'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOrder } from '@/lib/db'
import type { Order } from '@/types'
import { ArrowLeft, MapPin, Phone, User, Truck, Clock, CheckCircle, Package, Copy, CreditCard, MessageCircle, Hash, Package2 } from 'lucide-react'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  paid: { label: '待发货', icon: Clock, color: 'text-blue-700', bg: 'bg-blue-100' },
  shipped: { label: '运输中', icon: Truck, color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: '已送达', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: '已取消', icon: Package, color: 'text-gray-500', bg: 'bg-gray-100' },
}

export default function OrderDetailClient() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id ? decodeURIComponent(params.id as string) : ''
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.push('/login')
      return
    }
    if (orderId) {
      getOrder(orderId).then(o => {
        setOrder(o || null)
        setLoading(false)
      })
    }
  }, [orderId, router])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse text-gray-400 text-center py-20">加载中...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">订单不存在</p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-blue-600 hover:underline">返回订单列表</Link>
      </div>
    )
  }

  const status = statusConfig[order.status] || statusConfig.paid
  const StatusIcon = status.icon

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> 返回
      </button>

      {/* Order Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">订单号: <span className="font-bold text-gray-700">{order.id}</span></p>
          <p className="text-[13px] text-gray-400 mt-0.5">下单时间: {new Date(order.createdAt).toLocaleString('zh-CN')}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${status.bg} ${status.color}`}>
          <StatusIcon size={18} />
          {status.label}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-[var(--border-light)] rounded-xl p-5 mb-4">
        <h2 className="text-[15px] font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Package2 size={18} className="text-[var(--accent)]" />
          商品信息
        </h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-white shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--foreground)] truncate">{item.name}</p>
                <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                  商品ID: <span className="font-mono text-gray-500">{item.productId}</span>
                </p>
                <p className="text-[12px] text-[var(--text-tertiary)]">数量: x{item.quantity}</p>
              </div>
              <p className="text-[14px] font-bold text-[var(--foreground)]">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-[var(--border-light)]">
          <span className="text-[15px] font-bold text-[var(--foreground)]">商品总价</span>
          <span className="text-[22px] font-bold text-[var(--accent)]">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white border border-[var(--border-light)] rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-[var(--accent)]" />
          <h2 className="text-[15px] font-bold text-[var(--foreground)]">收货信息</h2>
        </div>
        <div className="space-y-3 text-[14px]">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User size={18} className="text-gray-400 shrink-0" />
            <div>
              <span className="text-[12px] text-gray-400 block">收货人</span>
              <span className="font-bold text-gray-800">{order.recipient}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone size={18} className="text-gray-400 shrink-0" />
            <div>
              <span className="text-[12px] text-gray-400 block">联系电话</span>
              <span className="font-bold text-gray-800">{order.phone}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[12px] text-gray-400 block">收货地址</span>
              <span className="font-bold text-gray-800">{order.shippingAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Info */}
      {order.trackingNumber && (
        <div className="bg-white border border-[var(--border-light)] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={18} className="text-[var(--accent)]" />
            <h2 className="text-[15px] font-bold text-[var(--foreground)]">物流信息</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-[12px] text-gray-400 block">物流公司</span>
                <span className="text-[14px] font-bold text-gray-800">{order.carrier}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-[12px] text-gray-400 block">快递单号</span>
                <span className="text-[14px] font-bold text-gray-800 font-mono">{order.trackingNumber}</span>
              </div>
              <button onClick={() => navigator.clipboard.writeText(order.trackingNumber || '')} className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg">
                <Copy size={14} /> 复制
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="bg-white border border-[var(--border-light)] rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={18} className="text-[var(--accent)]" />
          <h2 className="text-[15px] font-bold text-[var(--foreground)]">付款方式</h2>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="bg-white border border-[var(--border-light)] p-3 rounded-lg flex items-center justify-center">
            <img src="/assets/images/payments/Paypal-Logo-2022.png" alt="PayPal" className="h-8" />
          </div>
          <div>
            <span className="text-[16px] font-bold text-gray-800">PayPal</span>
            <p className="text-[14px] text-gray-500 mt-0.5">账号: <span className="font-semibold text-gray-700">s***3@163.com</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
