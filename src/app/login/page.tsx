'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginUser } from '@/lib/db'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const user = await loginUser(email, password)
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      window.dispatchEvent(new Event('storage'))
      router.push('/')
    } else {
      setError('邮箱或密码错误')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-[var(--foreground)] tracking-tight">登录</h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1.5">欢迎回来</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] text-[var(--text-secondary)] font-medium">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              className="w-full px-4 py-3 bg-[#f5f5f7] border border-[var(--border)] rounded-xl text-[14px] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] text-[var(--text-secondary)] font-medium">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="w-full px-4 py-3 bg-[#f5f5f7] border border-[var(--border)] rounded-xl text-[14px] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-white py-3 text-[14px] font-medium rounded-full hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
          还没有账号？{' '}
          <Link href="/register" className="text-[var(--accent)] hover:underline font-medium">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}
