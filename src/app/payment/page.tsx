'use client'

import { Suspense } from 'react'
import PaymentContent from './PaymentContent'

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
