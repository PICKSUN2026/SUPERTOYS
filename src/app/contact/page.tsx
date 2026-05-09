'use client'

import { Mail, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] hover:text-[var(--accent)] mb-8 transition-colors">
        <ArrowLeft size={14} strokeWidth={1.5} /> 返回首页
      </Link>

      <div className="mb-12">
        <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-5">
          <MessageSquare size={22} className="text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-[28px] font-bold text-[var(--foreground)] tracking-tight">联系我们</h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)] max-w-lg">
          如有任何问题、建议或合作意向，欢迎通过以下方式与我们取得联系。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-[var(--accent)]" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-2">发送邮件</h2>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">
              请将你的问题、建议或合作意向发送至以下邮箱。我们会在 1-3 个工作日内回复你的邮件。
              请尽量提供详细的信息，以便我们更高效地为你处理。
            </p>
            <a
              href="mailto:contact@supertoys.com"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 text-[13px] font-medium rounded-full hover:bg-[var(--accent-hover)] transition-all"
            >
              <Mail size={14} strokeWidth={1.5} />
              contact@supertoys.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#f5f5f7] rounded-2xl p-6 border border-[var(--border)]">
        <h3 className="text-[12px] font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider">邮件沟通说明</h3>
        <div className="space-y-2.5 text-[13px] text-[var(--text-secondary)] leading-relaxed">
          <p><strong className="text-[var(--foreground)]">客服咨询：</strong> 如遇订单问题、物流查询或商品疑问，请在邮件中注明你的订单号。</p>
          <p><strong className="text-[var(--foreground)]">商务合作：</strong> 如有品牌入驻、批发采购或市场营销合作意向，请简要介绍你的公司或品牌信息。</p>
          <p><strong className="text-[var(--foreground)]">售后反馈：</strong> 如果你对我们的商品或服务有任何建议，欢迎告知。</p>
          <p className="pt-3 border-t border-[var(--border)] text-[12px] text-[var(--text-tertiary)]">SUPERTOYS &copy; Copyright 2025 - 2026</p>
        </div>
      </div>
    </div>
  )
}
