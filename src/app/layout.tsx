import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'SUPERTOYS',
  description: '全球精选玩具，一站购齐',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="min-h-[100dvh]">{children}</main>
        <footer className="border-t border-gray-100 py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <img
                  src="/assets/images/supertoys-logo.png"
                  alt="SUPERTOYS"
                  className="h-5 w-auto"
                />
                <span>&copy; Copyright 2025 - 2026</span>
              </div>
              <div className="flex items-center gap-5">
                <Link href="/contact" className="text-sm text-gray-300 hover:text-gray-900 transition-colors">
                  联系我们
                </Link>
                <Link href="/products" className="text-sm text-gray-300 hover:text-gray-900 transition-colors">
                  全部商品
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
