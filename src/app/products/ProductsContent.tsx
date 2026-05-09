'use client'

import { useState, useEffect } from 'react'
import { getAllProducts } from '@/lib/db'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

export default function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">全部商品</h1>
        <p className="text-sm text-gray-400 mt-1">共 {loading ? '...' : products.length} 件商品</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">加载中...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">暂无商品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
