'use client'

import type { Product, SampleProduct } from '@/types'

function generateId(name: string): string {
  return `sample-${name.replace(/[\s\/]+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')}`
}

const rawProducts: SampleProduct[] = [
  { name: '乐高 经典创意箱 11022', category: '积木拼装', price: 599, imageUrl: 'https://picsum.photos/seed/lego1/400/400', description: '乐高经典系列，1630颗粒创意拼搭，激发无限想象力', stock: 30, shipping: 15, images: ['https://picsum.photos/seed/lego1/400/400', 'https://picsum.photos/seed/lego2/400/400', 'https://picsum.photos/seed/lego3/400/400'] },
  { name: 'Bandai 万代 RG 1/144 强袭自由高达', category: '高达模型', price: 299, imageUrl: 'https://picsum.photos/seed/gundam1/400/400', description: 'RG系列精密分色，无需涂装即可还原动画造型', stock: 20, shipping: 10, images: ['https://picsum.photos/seed/gundam1/400/400', 'https://picsum.photos/seed/gundam2/400/400'] },
  { name: '变形金刚 领袖级 擎天柱', category: '变形玩具', price: 459, imageUrl: 'https://picsum.photos/seed/optimus1/400/400', description: '电影版领袖级擎天柱，31步变形，声光特效', stock: 15, shipping: 20, images: ['https://picsum.photos/seed/optimus1/400/400', 'https://picsum.photos/seed/optimus2/400/400'] },
  { name: '芭比 梦幻衣橱套装', category: '芭比娃娃', price: 259, imageUrl: 'https://picsum.photos/seed/barbie1/400/400', description: '含芭比娃娃+20件时尚配件，角色扮演的最佳选择', stock: 25, shipping: 15 },
  { name: 'HOT TOYS 钢铁侠 Mark85 1/6 人偶', category: '收藏人偶', price: 1899, imageUrl: 'https://picsum.photos/seed/hottoys1/400/400', description: '1:6比例珍藏人偶，30个发光位，合金压铸主体', stock: 5, shipping: 30, images: ['https://picsum.photos/seed/hottoys1/400/400', 'https://picsum.photos/seed/hottoys2/400/400', 'https://picsum.photos/seed/hottoys3/400/400'] },
  { name: 'Tomica 多美卡 丰田AE86', category: '玩具车模', price: 39, imageUrl: 'https://picsum.photos/seed/tomica1/400/400', description: '1:64比例合金小车，经典头文字D AE86涂装', stock: 100, shipping: 8 },
  { name: 'Mighty Jaxx 慵懒熊猫 搪胶公仔', category: '潮流玩具', price: 399, imageUrl: 'https://picsum.photos/seed/mjaxx1/400/400', description: '搪胶工艺，手绘涂装，限量版艺术潮流公仔', stock: 10, shipping: 20 },
  { name: 'ThinkFun 重力迷宫 逻辑桌游', category: '益智玩具', price: 169, imageUrl: 'https://picsum.photos/seed/thinkfun1/400/400', description: 'STEM教育玩具，60关挑战，培养空间逻辑思维', stock: 35, shipping: 10 },
  { name: 'MGA 惊喜宝贝 彩虹亮片套装', category: '惊喜玩具', price: 129, imageUrl: 'https://picsum.photos/seed/lol1/400/400', description: '拆箱惊喜，每盒随机款式，收藏乐趣无穷', stock: 40, shipping: 12 },
  { name: 'Moose Toys 魔法独角兽 蓝色', category: '毛绒玩具', price: 149, imageUrl: 'https://picsum.photos/seed/plush1/400/400', description: '超柔软绒毛，触摸感应发声，可爱造型陪伴入睡', stock: 50, shipping: 10 },
  { name: 'Super7 希曼 骷髅王 ReAction 3.75寸', category: '动作人偶', price: 179, imageUrl: 'https://picsum.photos/seed/heiman1/400/400', description: '经典复古包装，3.75寸可动人偶，80年代怀旧收藏', stock: 22, shipping: 15 },
  { name: '任天堂 amiibo 林克 王国之泪', category: '游戏周边', price: 89, imageUrl: 'https://picsum.photos/seed/amiibo1/400/400', description: 'NFC互动模型，可在游戏中解锁专属道具', stock: 60, shipping: 8 },
]

export const ALL_PRODUCTS: Product[] = rawProducts.map(p => ({
  ...p,
  id: generateId(p.name),
}))

export function getCategories(): string[] {
  return [...new Set(ALL_PRODUCTS.map(p => p.category))]
}
