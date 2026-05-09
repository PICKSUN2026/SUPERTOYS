'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAllProducts, setProducts, getOrders, updateOrderTracking } from '@/lib/db'
import type { Product, Order } from '@/types'
import { Upload, Database, Package, Truck, Download, Check, AlertCircle, FileSpreadsheet, RefreshCw } from 'lucide-react'
import * as XLSX from 'xlsx'

const statusLabels: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
}

export default function AdminPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const trackingFileRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setLocalProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'products' | 'tracking'>('products')

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    setIsLoggedIn(!!user)
    if (user) {
      loadData()
    }
  }, [])

  const loadData = async () => {
    const [allProducts, allOrders] = await Promise.all([getAllProducts(), getOrders()])
    setLocalProducts(allProducts)
    setOrders(allOrders)
  }

  // Download sample Excel
  const downloadSample = () => {
    const headers = ['商品名称', '分类', '价格', '图片URL', '描述', '库存']
    const data = [
      ['乐高 经典创意箱', '积木拼装', 599, 'https://picsum.photos/seed/sample1/400/400', '经典创意积木', 50],
      ['Bandai 强袭自由高达', '高达模型', 299, 'https://picsum.photos/seed/sample2/400/400', 'RG系列高达模型', 40],
    ]
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
    ws['!colwidths'] = [30, 10, 10, 50, 40, 10]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '商品数据')
    XLSX.writeFile(wb, '商品数据模板.xlsx')
  }

  // Upload products Excel
  const handleUploadProducts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadResult(null)
    setUploading(true)

    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 })

      if (rows.length < 2) {
        setUploadResult({ type: 'error', msg: 'Excel 文件为空或只有表头' })
        setUploading(false)
        return
      }

      const headers = rows[0] as string[]
      const nameIdx = headers.findIndex((h: string) => h.includes('商品名称') || h.includes('名称') || h.includes('name'))
      const catIdx = headers.findIndex((h: string) => h.includes('分类') || h.includes('category'))
      const priceIdx = headers.findIndex((h: string) => h.includes('价格') || h.includes('price'))
      const imgIdx = headers.findIndex((h: string) => h.includes('图片') || h.includes('image') || h.includes('url'))
      const descIdx = headers.findIndex((h: string) => h.includes('描述') || h.includes('description'))
      const stockIdx = headers.findIndex((h: string) => h.includes('库存') || h.includes('stock'))

      if (nameIdx === -1 || priceIdx === -1) {
        setUploadResult({ type: 'error', msg: 'Excel 至少需要"商品名称"和"价格"两列' })
        setUploading(false)
        return
      }

      const products: Product[] = []
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i] as any[]
        if (!row[nameIdx]) continue

        products.push({
          id: `prod-${Date.now()}-${i}`,
          name: String(row[nameIdx] || '').trim(),
          category: catIdx >= 0 ? String(row[catIdx] || '未分类').trim() : '未分类',
          price: Number(row[priceIdx]) || 0,
          imageUrl: imgIdx >= 0 ? String(row[imgIdx] || '').trim() || `https://picsum.photos/seed/prod-${i}/400/400` : `https://picsum.photos/seed/prod-${i}/400/400`,
          description: descIdx >= 0 ? String(row[descIdx] || '').trim() : '',
          stock: stockIdx >= 0 ? Number(row[stockIdx]) || 0 : 99,
        })
      }

      await setProducts(products)
      await loadData()
      setUploadResult({ type: 'success', msg: `成功导入 ${products.length} 件商品` })
    } catch (err) {
      setUploadResult({ type: 'error', msg: '文件解析失败：' + (err as Error).message })
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Upload tracking Excel
  const handleUploadTracking = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadResult(null)
    setUploading(true)

    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 })

      if (rows.length < 2) {
        setUploadResult({ type: 'error', msg: '文件为空或只有表头' })
        setUploading(false)
        return
      }

      const headers = rows[0] as string[]
      const orderIdx = headers.findIndex((h: string) => h.includes('订单号') || h.includes('order') || h.includes('订单'))
      const trackingIdx = headers.findIndex((h: string) => h.includes('快递单号') || h.includes('物流单号') || h.includes('tracking'))
      const carrierIdx = headers.findIndex((h: string) => h.includes('快递公司') || h.includes('物流公司') || h.includes('carrier'))

      if (orderIdx === -1 || trackingIdx === -1) {
        setUploadResult({ type: 'error', msg: 'Excel 需要"订单号"和"快递单号"两列' })
        setUploading(false)
        return
      }

      let updatedCount = 0
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i] as any[]
        const orderId = String(row[orderIdx] || '').trim()
        const trackingNumber = String(row[trackingIdx] || '').trim()
        const carrier = carrierIdx >= 0 ? String(row[carrierIdx] || '').trim() || '快递公司' : '快递公司'

        if (orderId && trackingNumber) {
          await updateOrderTracking(orderId, trackingNumber, carrier)
          updatedCount++
        }
      }

      await loadData()
      setUploadResult({ type: 'success', msg: `成功更新 ${updatedCount} 个订单的物流信息` })
    } catch (err) {
      setUploadResult({ type: 'error', msg: '文件解析失败：' + (err as Error).message })
    }
    setUploading(false)
    if (trackingFileRef.current) trackingFileRef.current.value = ''
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Database size={48} className="mx-auto text-gray-200" />
        <p className="mt-4 text-lg text-gray-400">请先登录后管理</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          去登录
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">后台管理</h1>
      <p className="text-sm text-gray-400 mb-8">管理商品数据和订单物流信息</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package size={16} /> 商品管理
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'tracking' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Truck size={16} /> 物流管理
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={18} /> 上传商品数据
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              上传 Excel 文件(.xlsx/.xls)，至少包含「商品名称」「价格」两列，可选「分类」「图片URL」「描述」「库存」
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {uploading ? <RefreshCw size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                {uploading ? '上传中...' : '选择文件上传'}
              </button>
              <button
                onClick={downloadSample}
                className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Download size={16} /> 下载模板
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleUploadProducts}
              className="hidden"
            />
          </div>

          {/* Current Products */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Database size={18} /> 当前商品 ({products.length} 件)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-400">
                    <th className="pb-3 font-medium">商品名称</th>
                    <th className="pb-3 font-medium">分类</th>
                    <th className="pb-3 font-medium">价格</th>
                    <th className="pb-3 font-medium">库存</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 20).map(p => (
                    <tr key={p.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded object-cover bg-gray-50" />
                          <span className="text-gray-900 truncate max-w-[200px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500">{p.category}</td>
                      <td className="py-3 font-medium">${p.price}</td>
                      <td className="py-3 text-gray-500">{p.stock}</td>
                    </tr>
                  ))}
                  {products.length > 20 && (
                    <tr>
                      <td colSpan={4} className="py-3 text-center text-gray-400 text-xs">
                        ... 还有 {products.length - 20} 件商品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={18} /> 上传物流信息
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              上传 Excel 文件，包含「订单号」「快递单号」两列，可选「快递公司」列
            </p>

            <button
              onClick={() => trackingFileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {uploading ? <RefreshCw size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
              {uploading ? '上传中...' : '选择物流文件上传'}
            </button>
            <input
              ref={trackingFileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleUploadTracking}
              className="hidden"
            />
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} /> 订单列表 ({orders.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-400">
                    <th className="pb-3 font-medium">订单号</th>
                    <th className="pb-3 font-medium">金额</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium">快递单号</th>
                    <th className="pb-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4">
                        <span className="text-xs font-mono text-gray-700">{o.id}</span>
                      </td>
                      <td className="py-3 font-medium">${o.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          o.status === 'paid' ? 'text-blue-600 bg-blue-50' :
                          o.status === 'shipped' ? 'text-purple-600 bg-purple-50' :
                          o.status === 'delivered' ? 'text-green-600 bg-green-50' :
                          'text-gray-400 bg-gray-50'
                        }`}>
                          {statusLabels[o.status]}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-500 font-mono">
                        {o.trackingNumber || '-'}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => router.push(`/orders/${o.id}`)}
                          className="text-xs text-gray-500 hover:text-gray-900 underline"
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {uploadResult && (
        <div className={`mt-4 flex items-center gap-2 p-4 rounded-xl text-sm ${
          uploadResult.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {uploadResult.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {uploadResult.msg}
        </div>
      )}
    </div>
  )
}
