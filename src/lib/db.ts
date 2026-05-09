'use client'

import { supabase } from './supabase'
import type { CartItem, Order, User, Product, SampleProduct } from '@/types'

// ========== Products ==========
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('getAllProducts error:', error)
    return []
  }
  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category || '',
    price: p.price,
    imageUrl: p.image_url || '',
    description: p.description || '',
    stock: p.stock || 0,
    shipping: p.shipping || 0,
    images: p.images || [],
  }))
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error || !data) return undefined
  return {
    id: data.id,
    name: data.name,
    category: data.category || '',
    price: data.price,
    imageUrl: data.image_url || '',
    description: data.description || '',
    stock: data.stock || 0,
    shipping: data.shipping || 0,
    images: data.images || [],
  }
}

export async function getCategories(): Promise<string[]> {
  const products = await getAllProducts()
  return [...new Set(products.map(p => p.category))]
}

export async function setProducts(products: Product[]): Promise<void> {
  // Convert to Supabase format
  const rows = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image_url: p.imageUrl,
    description: p.description,
    stock: p.stock,
    shipping: p.shipping,
    images: p.images,
  }))
  // Delete existing products first, then insert
  const { error: delErr } = await supabase.from('products').delete().neq('id', '___dummy___')
  if (delErr) {
    console.error('setProducts delete error:', delErr)
    return
  }
  if (rows.length > 0) {
    const { error } = await supabase.from('products').insert(rows)
    if (error) console.error('setProducts insert error:', error)
  }
}

// ========== Cart (localStorage - no change needed) ==========
const CART_KEY = 'supertoys_cart'

export async function getCart(): Promise<CartItem[]> {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function addToCart(item: CartItem): Promise<void> {
  const cart = await getCart()
  const existing = cart.find(i => i.productId === item.productId)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    cart.push(item)
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export async function updateCartItem(productId: string, quantity: number): Promise<void> {
  let cart = await getCart()
  if (quantity <= 0) {
    cart = cart.filter(i => i.productId !== productId)
  } else {
    const item = cart.find(i => i.productId === productId)
    if (item) item.quantity = quantity
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export async function clearCart(): Promise<void> {
  localStorage.removeItem(CART_KEY)
}

// ========== Orders ==========
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('getOrders error:', error)
    return []
  }
  return (data || []).map(o => ({
    id: o.id,
    items: o.items || [],
    total: o.total,
    status: o.status,
    createdAt: o.created_at,
    shippingAddress: o.shipping_address,
    phone: o.phone,
    recipient: o.recipient,
    trackingNumber: o.tracking_number || '',
    carrier: o.carrier || '',
    paymentMethod: o.payment_method || 'PayPal',
  }))
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error || !data) return undefined
  return {
    id: data.id,
    items: data.items || [],
    total: data.total,
    status: data.status,
    createdAt: data.created_at,
    shippingAddress: data.shipping_address,
    phone: data.phone,
    recipient: data.recipient,
    trackingNumber: data.tracking_number || '',
    carrier: data.carrier || '',
    paymentMethod: data.payment_method || 'PayPal',
  }
}

export async function createOrder(order: Order): Promise<void> {
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    user_id: getCurrentUserId() || '00000000-0000-0000-0000-000000000001',
    items: order.items,
    total: order.total,
    status: order.status || 'paid',
    created_at: order.createdAt || new Date().toISOString(),
    shipping_address: order.shippingAddress,
    phone: order.phone,
    recipient: order.recipient,
    tracking_number: order.trackingNumber || '',
    carrier: order.carrier || '',
    payment_method: order.paymentMethod || 'PayPal',
  })
  if (error) console.error('createOrder error:', error)
}

export async function updateOrderTracking(orderId: string, trackingNumber: string, carrier: string): Promise<void> {
  const { error } = await supabase.from('orders').update({
    tracking_number: trackingNumber,
    carrier: carrier,
    status: 'shipped',
  }).eq('id', orderId)
  if (error) console.error('updateOrderTracking error:', error)
}

// ========== Users ==========
export async function registerUser(user: User): Promise<boolean> {
  const { data: existing, error: checkErr } = await supabase.from('users').select('id').eq('email', user.email).limit(1)
  if (checkErr || (existing && existing.length > 0)) return false

  const { error } = await supabase.from('users').insert({
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
  })
  return !error
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('id, username, email').eq('email', email).eq('password', password).limit(1)
  if (error || !data || data.length === 0) return null
  return data[0] as User
}

export async function getUser(id: string): Promise<User | undefined> {
  const { data, error } = await supabase.from('users').select('id, username, email').eq('id', id).single()
  if (error || !data) return undefined
  return data as User
}

function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('currentUser')
    return raw ? JSON.parse(raw).id : null
  } catch {
    return null
  }
}

// ========== Product ID utility ==========
export function generateProductId(name: string): string {
  return `sample-${name.replace(/[\s\/]+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')}`
}

export function getProductByIdFromSample(id: string): Product | undefined {
  return undefined // No longer needed, use getProduct()
}

export const SAMPLE_PRODUCTS: SampleProduct[] = []

export async function loadSampleData(): Promise<void> {
  // No-op: data is already in Supabase
}
