import { useState } from 'react'

interface Props {
  onLogin: (user: { name: string }) => void
}

export default function LoginGate({ onLogin }: Props) {
  const [step, setStep] = useState<'scan' | 'register'>('scan')
  const [form, setForm] = useState({ name: '', wechat: '', purpose: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.wechat) return
    setSubmitted(true)
    // 保存登录状态
    localStorage.setItem('oc-academy-user', JSON.stringify(form))
    onLogin({ name: form.name })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">注册成功！</h2>
          <p className="text-slate-500 mb-6">
            欢迎 <strong className="text-blue-600">{form.name}</strong> 加入 OpenClaw 学院 🎉
          </p>
          <p className="text-sm text-slate-400">
            我们已收到你的注册信息，感谢关注！
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">OC</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-xl">OpenClaw</span>
            <span className="font-medium text-blue-600 text-xl ml-1">学院</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => setStep('scan')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              step === 'scan' ? 'bg-white shadow text-blue-600' : 'text-slate-500'
            }`}
          >
            ① 加微信
          </button>
          <button
            onClick={() => setStep('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              step === 'register' ? 'bg-white shadow text-blue-600' : 'text-slate-500'
            }`}
          >
            ② 注册
          </button>
        </div>

        {step === 'scan' && (
          <div className="text-center">
            <p className="text-slate-600 mb-6 text-sm">
              长按下方二维码，<strong>添加客服微信</strong><br />
              注明"OpenClaw学院"，通过后即可注册
            </p>
            <div className="bg-slate-50 rounded-xl p-4 inline-block mb-6">
              <img
                src="/wechat-qr.jpg"
                alt="微信二维码"
                className="w-52 h-52 object-contain rounded-lg"
              />
            </div>
            <p className="text-xs text-slate-400 mb-4">
              💡 扫码后请回复"OpenClaw学院"，客服将尽快处理
            </p>
            <button
              onClick={() => setStep('register')}
              className="text-blue-600 text-sm hover:underline"
            >
              已加微信，去注册 →
            </button>
          </div>
        )}

        {step === 'register' && (
          <div>
            <p className="text-slate-600 mb-6 text-sm text-center">
              确认已添加客服微信后，填写以下信息完成注册 👇
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入你的姓名"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  微信账号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入你的微信"
                  value={form.wechat}
                  onChange={e => setForm({ ...form, wechat: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  使用目的 <span className="text-slate-400">(选填)</span>
                </label>
                <select
                  value={form.purpose}
                  onChange={e => setForm({ ...form, purpose: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600"
                >
                  <option value="">请选择</option>
                  <option value="个人学习">个人学习</option>
                  <option value="公司使用">公司/团队使用</option>
                  <option value="客户部署">帮客户安装部署</option>
                  <option value="技术研究">技术研究</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                提交注册
              </button>
            </form>
            <button
              onClick={() => setStep('scan')}
              className="w-full mt-3 text-slate-400 text-sm hover:text-slate-600"
            >
              ← 还没加微信？
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
