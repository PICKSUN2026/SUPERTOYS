'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getOrder } from '@/lib/db'
import type { Order } from '@/types'
import { CheckCircle, CreditCard, Banknote, Wallet } from 'lucide-react'

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: Wallet },
  { id: 'alipay', name: '支付宝', icon: CreditCard },
  { id: 'card', name: '银行卡支付', icon: Banknote },
]

export default function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [selectedMethod, setSelectedMethod] = useState('wechat')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (!orderId) return
    const load = async () => {
      const o = await getOrder(orderId)
      setOrder(o || null)
    }
    load()
  }, [orderId])

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载订单信息...</div>
      </div>
    )
  }

  if (paid) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500" />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">支付成功</h1>
        <p className="mt-2 text-gray-500">订单 {order.id} 已完成支付</p>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => router.push(`/orders/${order.id}`)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            查看订单
          </button>
          <button
            onClick={() => router.push('/products')}
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            继续购物
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">确认支付</h1>
      <p className="text-sm text-gray-400 mb-8">订单号: {order.id}</p>

      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center mb-8">
        <p className="text-sm text-gray-500">支付金额</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
      </div>

      <div className="space-y-3 mb-8">
        <p className="text-sm font-medium text-gray-500">选择支付方式</p>
        {paymentMethods.map(method => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
              selectedMethod === method.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <method.icon size={24} className={selectedMethod === method.id ? 'text-gray-900' : 'text-gray-400'} />
            <span className={`font-medium ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-600'}`}>
              {method.name}
            </span>
            {selectedMethod === method.id && (
              <CheckCircle size={18} className="ml-auto text-gray-900" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setPaying(true)
          setTimeout(() => {
            setPaying(false)
            setPaid(true)
          }, 1500)
        }}
        disabled={paying}
        className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {paying ? '支付处理中...' : `确认支付 $${order.total.toFixed(2)}`}
      </button>

      <p className="mt-4 text-xs text-gray-300 text-center">
        &copy; SUPERTOYS
      </p>
    </div>
  )
}
