import { createClient } from '@supabase/supabase-js'
import ProductDetailClient from '@/components/ProductDetailClient'

// 在构建时预生成所有商品静态页面
export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('products').select('id')
  return (data || []).map(p => ({ id: p.id }))
}

export default function ProductDetailPage() {
  return <ProductDetailClient />
}
