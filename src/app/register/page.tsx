'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const formatPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    if (digits.length <= 3) setForm(prev => ({ ...prev, phone: digits }))
    else if (digits.length <= 6) setForm(prev => ({ ...prev, phone: `(${digits.slice(0, 3)}) ${digits.slice(3)}` }))
    else setForm(prev => ({ ...prev, phone: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}` }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 字段校验
    if (form.password !== form.confirmPassword) { setError('密码输入不一致'); return }
    if (form.password.length < 6) { setError('密码至少需要6位'); return }
    if (form.phone.replace(/\D/g, '').length !== 10) { setError('请输入有效的美国手机号码（10位）'); return }

    setLoading(true)
    // 模拟延迟后始终返回注册失败
    await new Promise(r => setTimeout(r, 1500))
    setError('注册失败，请稍后重试')
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">创建账号</h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1.5">注册个人账号</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: '用户名', key: 'username', placeholder: '请输入用户名', type: 'text' },
            { label: '邮箱', key: 'email', placeholder: '请输入邮箱地址', type: 'email' },
            { label: '手机号码', key: 'phone', placeholder: '(123) 456-7890', type: 'text' },
            { label: '密码', key: 'password', placeholder: '至少6位密码', type: 'password' },
            { label: '确认密码', key: 'confirmPassword', placeholder: '再次输入密码', type: 'password' },
          ].map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-[11px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">{field.label}</label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={field.key === 'phone' ? formatPhone : update(field.key)}
                placeholder={field.placeholder}
                required
                minLength={field.key === 'password' ? 6 : undefined}
                className="w-full px-4 py-2.5 bg-white border border-[var(--border)] text-[14px] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              {field.key === 'phone' && (
                <p className="text-[11px] text-[var(--text-tertiary)]">格式: (123) 456-7890</p>
              )}
            </div>
          ))}

          {error && <p className="text-[13px] text-[var(--accent)]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !form.username || !form.email || !form.phone || !form.password || !form.confirmPassword}
            className="w-full bg-[var(--accent)] text-white py-3 text-[14px] font-bold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {loading ? '提交中...' : '提交注册'}
          </button>

          <p className="text-[11px] text-[var(--text-tertiary)] text-center">
            点击提交即表示同意我们的服务条款和隐私政策
          </p>
        </form>

        <p className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
          已有账号？ <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">登录</Link>
        </p>
      </div>
    </div>
  )
}
