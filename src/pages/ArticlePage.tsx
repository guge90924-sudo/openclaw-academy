import { useMemo } from 'react'
import { categories, getArticleBySlug } from '../data/guides'

interface Props {
  slug: string
  onNavigate: (page: 'home' | 'category' | 'article', category?: string, slug?: string) => void
}

function renderMarkdown(content: string): string {
  let html = content
    // Headers
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Tables (simple)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      if (cells.some(c => /^-+$/.test(c.trim()))) {
        return '' // header separator
      }
      return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`
    })
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // Wrap consecutive li in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>' + match + '</ul>'
  })

  // Wrap tables
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
    return '<table>' + match + '</table>'
  })

  // Paragraphs
  const lines = html.split('\n')
  const result: string[] = []
  let inBlock = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (inBlock) {
        result.push('')
        inBlock = false
      }
      continue
    }
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<table') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('</') ||
      inBlock
    ) {
      result.push(trimmed)
      if (!trimmed.startsWith('</') && !trimmed.startsWith('<h2') && !trimmed.startsWith('<h3')) {
        inBlock = true
      } else {
        inBlock = false
      }
    } else {
      result.push(`<p>${trimmed}</p>`)
    }
  }

  return result.join('\n')
}

export default function ArticlePage({ slug, onNavigate }: Props) {
  const guide = getArticleBySlug(slug)

  const htmlContent = useMemo(() => {
    if (!guide) return ''
    return renderMarkdown(guide.content)
  }, [guide])

  if (!guide) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-500">文章不存在</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 text-blue-600 hover:underline"
        >
          返回首页
        </button>
      </div>
    )
  }

  const category = categories.find(c => c.id === guide.category)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600">
          首页
        </button>
        <span>/</span>
        {category && (
          <>
            <button
              onClick={() => onNavigate('category', category.id)}
              className="hover:text-blue-600"
            >
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800">{guide.title}</span>
      </div>

      <div className="flex gap-12">
        {/* Article */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${
                guide.difficulty === '入门' ? 'bg-green-100 text-green-700' :
                guide.difficulty === '进阶' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {guide.difficulty}
              </span>
              <span className="text-sm text-slate-400">🕐 {guide.readTime}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{guide.title}</h1>
            <p className="text-lg text-slate-500">{guide.description}</p>
          </header>

          {/* Content */}
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between">
            <button
              onClick={() => category && onNavigate('category', category.id)}
              className="text-blue-600 hover:underline"
            >
              ← 返回 {category?.name}
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-500 hover:text-blue-600"
            >
              回首页
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              本页目录
            </h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block text-slate-600 hover:text-blue-600">什么是 OpenClaw</a>
              <a href="#" className="block text-slate-600 hover:text-blue-600">OpenClaw 能做什么</a>
              <a href="#" className="block text-slate-600 hover:text-blue-600">基本概念</a>
              <a href="#" className="block text-slate-600 hover:text-blue-600">下一步</a>
            </nav>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 提示</h4>
              <p className="text-xs text-blue-600">
                觉得内容有帮助？收藏本页，随时回来复习！
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
