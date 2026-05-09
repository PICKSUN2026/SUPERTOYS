import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bsknpdiqoserohgwauil.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_QTon4bz0qpX0LHo28DHVnQ_nidlXx49'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 用户类型
export interface User {
  id: string
  username: string
  email: string
}

// 商品类型
export interface Product {
  id: string
  name: string
  category: string
  price: number
  image_url: string
  description: string
  stock: number
  shipping: number
  images: string[]
}

// 订单类型
export interface Order {
  id: string
  user_id: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: string
  created_at: string
  shipping_address: string
  phone: string
  recipient: string
  tracking_number?: string
  carrier?: string
  payment_method?: string
}
