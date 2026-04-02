import { useState, useEffect } from 'react'
import './index.css'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ArticlePage from './pages/ArticlePage'
import LoginGate from './components/LoginGate'
import { guides } from './data/guides'

type Page = 'home' | 'category' | 'article'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentSlug, setCurrentSlug] = useState<string>('')
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    // 检查登录状态
    const saved = localStorage.getItem('oc-academy-user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('oc-academy-user')
      }
    }
  }, [])

  const navigateTo = (page: Page, category?: string, slug?: string) => {
    setCurrentPage(page)
    setCurrentCategory(category || '')
    setCurrentSlug(slug || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 未登录，显示登录门槛
  if (!user) {
    return <LoginGate onLogin={setUser} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">OC</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-lg">OpenClaw</span>
              <span className="font-medium text-blue-600 text-lg ml-1">学院</span>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden md:block">
              👋 欢迎，{user.name}
            </span>
            <button
              onClick={() => {
                setUser(null)
                localStorage.removeItem('oc-academy-user')
              }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <HomePage onNavigate={navigateTo} />
        )}
        {currentPage === 'category' && (
          <CategoryPage categoryId={currentCategory} onNavigate={navigateTo} />
        )}
        {currentPage === 'article' && (
          <ArticlePage slug={currentSlug} onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm">
            OpenClaw学院 · 帮助更多人用好 OpenClaw
          </p>
          <p className="text-xs mt-2 text-slate-500">
            本站点仅供学习交流，OpenClaw 版权归其开发者所有
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
