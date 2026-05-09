'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, LogIn, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCart } from '@/lib/db'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('currentUser'))
    const updateCart = async () => {
      const cart = await getCart()
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
    }
    checkLogin()
    updateCart()
    window.addEventListener('storage', checkLogin)
    window.addEventListener('cart-updated', updateCart)
    return () => {
      window.removeEventListener('storage', checkLogin)
      window.removeEventListener('cart-updated', updateCart)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/products', label: '全部商品' },
    { href: '/orders', label: '我的订单' },
    { href: '/contact', label: '联系我们' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/assets/images/supertoys-logo.png"
              alt="SUPERTOYS"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-[13px] rounded-md transition-all ${
                  pathname === link.href
                    ? 'text-[var(--accent)] bg-[var(--accent)]/5 font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/cart"
              className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-gray-50"
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-white text-[10px] font-medium min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-gray-50"
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            ) : (
              <Link href="/login" className="p-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-gray-50">
                <LogIn size={18} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--foreground)]"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white/95 backdrop-blur-lg">
          <div className="px-5 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-sm ${
                  pathname === link.href ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-secondary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border)] pt-3 flex gap-4">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <ShoppingCart size={16} strokeWidth={1.5} /> 购物车 {cartCount > 0 && `(${cartCount})`}
              </Link>
              {isLoggedIn ? (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <LogOut size={16} strokeWidth={1.5} /> 退出
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <LogIn size={16} strokeWidth={1.5} /> 登录
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
