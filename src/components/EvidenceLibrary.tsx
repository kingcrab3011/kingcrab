import { Heart, Lightbulb, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { evidence } from '../data'

export default function EvidenceLibrary() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => evidence.filter(item => `${item.name} ${item.kind} ${item.detail} ${item.themes}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi'))), [query])
  return <section className="content-page"><div className="page-intro"><div><span className="eyebrow">CHUYỆN THẬT · Ý NGHĨA THẬT</span><h1>Kho dẫn chứng</h1><p>Những câu chuyện đa chiều giúp luận điểm trở nên gần gũi và thuyết phục.</p></div><span className="count-badge">{evidence.length} câu chuyện</span></div><label className="search-box evidence-search"><Search size={16} /><input aria-label="Tìm dẫn chứng" placeholder="Tìm nhân vật, chủ đề hoặc phẩm chất…" value={query} onChange={event => setQuery(event.target.value)} /></label><div className="evidence-guide"><span><Lightbulb size={16} /></span><p><b>Dẫn chứng tốt không chỉ để kể.</b> Hãy phân tích phẩm chất, liên hệ với luận điểm và nêu rõ ý nghĩa của câu chuyện.</p></div><div className="evidence-grid">{filtered.map(item => <article className="evidence-card" key={item.name}><span className="evidence-symbol"><Heart size={18} /></span><div><span className="evidence-kind">{item.kind}</span><h3>{item.name}</h3><p>{item.detail}</p><span className="evidence-themes">{item.themes}</span></div></article>)}</div>{filtered.length === 0 && <div className="empty-state"><span><Search size={24} /></span><h2>Chưa tìm thấy câu chuyện phù hợp</h2><p>Hãy thử một từ khóa khác.</p></div>}</section>
}
