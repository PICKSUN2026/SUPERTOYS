'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getOrders, loadSampleData } from '@/lib/db'
import type { Order } from '@/types'
import { Package, ChevronRight, PackageCheck, Truck, Clock, CheckCircle } from 'lucide-react'

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  paid: { label: '待发货', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  shipped: { label: '运输中', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  delivered: { label: '已送达', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  cancelled: { label: '已取消', icon: Package, color: 'text-gray-400', bg: 'bg-gray-50' },
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loaded, setLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.push('/login')
      return
    }
    setIsLoggedIn(true)
    const load = async () => {
      await loadSampleData()
      const allOrders = await getOrders()
      setOrders(allOrders)
      setLoaded(true)
    }
    load()
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package size={48} className="mx-auto text-gray-200" />
        <p className="mt-4 text-lg text-gray-400">请先登录查看订单</p>
        <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 font-medium rounded-full hover:bg-blue-700 transition-colors">
          去登录
        </Link>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package size={48} className="mx-auto text-gray-200" />
        <p className="mt-4 text-lg text-gray-400">暂无订单</p>
        <Link href="/products" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          去逛逛
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">我的订单</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const status = statusConfig[order.status] || statusConfig.paid
          const StatusIcon = status.icon

          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${status.bg} rounded-full flex items-center justify-center`}>
                    <StatusIcon size={16} className={status.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{status.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">订单号: {order.id}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>

              {/* Items preview */}
              <div className="flex items-center gap-3">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-50">
                    +{order.items.length - 3}
                  </div>
                )}
                <div className="ml-auto text-right">
                  <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">共 {order.items.length} 件</p>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-300 mt-3">
                下单时间: {new Date(order.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
