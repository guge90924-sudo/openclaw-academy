import { categories, guides } from '../data/guides'

interface Props {
  onNavigate: (page: 'home' | 'category' | 'article', category?: string, slug?: string) => void
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  red: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
}

const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-600',
  red: 'bg-red-600',
  teal: 'bg-teal-600',
}

export default function HomePage({ onNavigate }: Props) {
  const featuredGuides = guides.slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            OpenClaw<span className="text-blue-200">学院</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            专为已安装 OpenClaw 的用户打造的学习平台，助你从入门到精通
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('category', 'getting-started')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              开始学习 →
            </button>
            <button
              onClick={() => onNavigate('category', 'daily-use')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
            >
              日常使用技巧
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{guides.length}+</div>
              <div className="text-slate-500 text-sm mt-1">精品教程</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-slate-500 text-sm mt-1">学习分类</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">免费</div>
              <div className="text-slate-500 text-sm mt-1">全部内容</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">学习路径</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.id)}
                className={`text-left p-6 rounded-xl border-2 transition-all ${colorMap[cat.color]}`}
              >
                <div className={`w-10 h-10 rounded-lg ${iconBgMap[cat.color]} text-white text-lg flex items-center justify-center mb-3`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                <p className="text-sm opacity-80">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">热门教程</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredGuides.map(guide => {
              const cat = categories.find(c => c.id === guide.category)
              return (
                <button
                  key={guide.slug}
                  onClick={() => onNavigate('article', guide.category, guide.slug)}
                  className="text-left p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      guide.difficulty === '入门' ? 'bg-green-100 text-green-700' :
                      guide.difficulty === '进阶' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {guide.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">{guide.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{guide.title}</h3>
                  <p className="text-sm text-slate-500">{guide.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">准备好开始了吗？</h2>
          <p className="text-slate-500 mb-8">从快速入门开始，踏出使用 OpenClaw 的第一步</p>
          <button
            onClick={() => onNavigate('article', 'getting-started', 'what-is-openclaw')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            阅读第一篇教程 →
          </button>
        </div>
      </section>
    </div>
  )
}
