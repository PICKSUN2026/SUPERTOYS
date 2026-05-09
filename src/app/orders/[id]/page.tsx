import { createClient } from '@supabase/supabase-js'
import OrderDetailClient from '@/components/OrderDetailClient'

// 在构建时预生成订单静态页面
export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('orders').select('id')
  return (data || []).map(o => ({ id: o.id }))
}

export default function OrderDetailPage() {
  return <OrderDetailClient />
}
