export interface Product {
  id: string
  name: string
  category: string
  price: number
  imageUrl: string
  description: string
  stock: number
  images?: string[]
  shipping?: number
}

export interface CartItem {
  productId: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: string
  phone: string
  recipient: string
  trackingNumber?: string
  carrier?: string
  paymentMethod?: string
}

export interface User {
  id: string
  username: string
  email: string
  password: string
}

export interface SampleProduct {
  name: string
  category: string
  price: number
  imageUrl: string
  description: string
  stock: number
  shipping?: number
  images?: string[]
}
