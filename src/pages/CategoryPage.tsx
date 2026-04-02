import { categories, getGuidesByCategory } from '../data/guides'

interface Props {
  categoryId: string
  onNavigate: (page: 'home' | 'category' | 'article', category?: string, slug?: string) => void
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red: 'bg-red-50 text-red-700 border-red-200',
}

const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-600',
  teal: 'bg-teal-600',
  red: 'bg-red-600',
}

export default function CategoryPage({ categoryId, onNavigate }: Props) {
  const category = categories.find(c => c.id === categoryId)
  const guides = getGuidesByCategory(categoryId)

  if (!category) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-500">分类不存在</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 text-blue-600 hover:underline"
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600">
          首页
        </button>
        <span>/</span>
        <span className="text-slate-800">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className={`w-16 h-16 rounded-xl ${iconBgMap[category.color]} text-white text-2xl flex items-center justify-center mb-4`}>
          {category.icon}
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{category.name}</h1>
        <p className="text-slate-500">{category.description}</p>
      </div>

      {/* Guide List */}
      <div className="space-y-4">
        {guides.map(guide => (
          <button
            key={guide.slug}
            onClick={() => onNavigate('article', categoryId, guide.slug)}
            className="w-full text-left p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    guide.difficulty === '入门' ? 'bg-green-100 text-green-700' :
                    guide.difficulty === '进阶' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {guide.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">🕐 {guide.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">{guide.title}</h2>
                <p className="text-sm text-slate-500">{guide.description}</p>
              </div>
              <div className="text-blue-600 text-sm font-medium flex items-center gap-1">
                阅读
                <span>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          该分类暂无教程，即将上线...
        </div>
      )}

      {/* Other Categories */}
      <div className="mt-16 pt-12 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">其他分类</h3>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c.id !== categoryId).map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('category', cat.id)}
              className={`px-4 py-2 rounded-lg border text-sm ${colorMap[cat.color]}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
