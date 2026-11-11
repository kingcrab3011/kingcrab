import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Bookmark, BookOpen, Check, ChevronDown, Clock3, Feather, FileText, GraduationCap, Heart, Lightbulb, Menu, Moon, PenLine, Search, Sparkles, Sun, Target, X } from 'lucide-react'
import { evidence, prompts } from './data'
import PromptLibrary from './components/PromptLibrary'
import EssayWorkspace from './components/EssayWorkspace'
import EvidenceLibrary from './components/EvidenceLibrary'

type Tab = 'Tổng quan' | 'Kho đề' | 'Luyện viết' | 'Dẫn chứng' | 'Bài nháp'
type Draft = { id: string; title: string; body: string; updatedAt: string }
const STORAGE_KEY = 'van-nghi-luan-lab-drafts-v1'

function loadDrafts(): Draft[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Draft[] } catch { return [] }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0])
  const [drafts, setDrafts] = useState<Draft[]>(loadDrafts)
  const [activeDraftId, setActiveDraftId] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [showInfo, setShowInfo] = useState(false)
  const activeDraft = drafts.find(draft => draft.id === activeDraftId)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts)) }, [drafts])
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const updateDraft = (body: string, title = selectedPrompt.title) => {
    const id = activeDraftId || crypto.randomUUID()
    setActiveDraftId(id)
    setDrafts(current => {
      const existing = current.find(item => item.id === id)
      const next = { id, title, body, updatedAt: new Date().toISOString() }
      return existing ? current.map(item => item.id === id ? next : item) : [next, ...current]
    })
  }
  const startWriting = (prompt = prompts[0], draft?: Draft) => {
    setSelectedPrompt(prompt)
    setActiveDraftId(draft?.id || '')
    setTab('Luyện viết')
    setMobileOpen(false)
  }
  const navigation: Tab[] = ['Tổng quan', 'Kho đề', 'Luyện viết', 'Dẫn chứng', 'Bài nháp']
  const navIcon = (item: Tab) => item === 'Tổng quan' ? <BookOpen size={17} /> : item === 'Kho đề' ? <Target size={17} /> : item === 'Luyện viết' ? <PenLine size={17} /> : item === 'Dẫn chứng' ? <Lightbulb size={17} /> : <FileText size={17} />
  const go = (item: Tab) => { setTab(item); setMobileOpen(false) }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <a className="brand" href="#home" onClick={event => { event.preventDefault(); go('Tổng quan') }}><span className="brand-mark"><Feather size={19} /></span><span><strong>Văn Nghị Luận</strong><small>LAB · 2026—2027</small></span></a>
      <div className="side-label">KHÔNG GIAN HỌC TẬP</div>
      <nav className="side-nav" aria-label="Điều hướng chính">{navigation.map(item => <button key={item} className={`nav-item ${tab === item ? 'active' : ''}`} onClick={() => go(item)}>{navIcon(item)}<span>{item}</span>{item === 'Bài nháp' && drafts.length > 0 && <em>{drafts.length}</em>}</button>)}</nav>
      <div className="sidebar-note"><span className="note-icon"><Sparkles size={16} /></span><div><b>Mỗi bài viết là một hành trình</b><p>Viết bằng suy nghĩ của bạn. Tiến bộ từng ngày.</p></div></div>
      <button className="profile-button" onClick={() => setShowInfo(true)}><span className="avatar">12</span><span><b>Góc học tập</b><small>Lớp 12 · THPT Yên Lãng</small></span><ChevronDown size={15} /></button>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Đóng menu" onClick={() => setMobileOpen(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="mobile-brand"><button className="icon-button menu-button" aria-label="Mở menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><span className="brand-mark"><Feather size={17} /></span><b>Văn Nghị Luận Lab</b></div><div className="crumb"><span>Không gian học tập</span><span className="crumb-dot">/</span><strong>{tab}</strong></div><div className="top-actions"><span className="date-chip"><span className="live-dot" /> Năm học 2026–2027</span><button className="icon-button" aria-label={dark ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối'} onClick={() => setDark(value => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div></header>
      <div className="page-content">
        {tab === 'Tổng quan' && <Overview onNavigate={go} onStart={startWriting} drafts={drafts} onInfo={() => setShowInfo(true)} />}
        {tab === 'Kho đề' && <PromptLibrary onSelect={prompt => { setSelectedPrompt(prompt); startWriting(prompt) }} />}
        {tab === 'Luyện viết' && <EssayWorkspace prompt={selectedPrompt} draft={activeDraft} onUpdate={updateDraft} onChoosePrompt={() => go('Kho đề')} />}
        {tab === 'Dẫn chứng' && <EvidenceLibrary />}
        {tab === 'Bài nháp' && <DraftsView drafts={drafts} onOpen={draft => startWriting(prompts.find(prompt => prompt.title === draft.title) || selectedPrompt, draft)} onDelete={id => { if (window.confirm('Bạn có chắc muốn xóa bản nháp này?')) setDrafts(items => items.filter(item => item.id !== id)) }} onNew={() => startWriting()} />}
      </div>
    </main>
    {showInfo && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowInfo(false) }}><section className="info-modal" role="dialog" aria-modal="true" aria-labelledby="info-title"><button className="modal-close icon-button" onClick={() => setShowInfo(false)} aria-label="Đóng"><X size={18} /></button><span className="eyebrow">VỀ DỰ ÁN</span><h2 id="info-title">Văn Nghị Luận Lab</h2><p>Nền tảng học tập số hỗ trợ học sinh THPT rèn luyện nghị luận xã hội, phát triển tư duy phản biện và trau chuốt tiếng Việt.</p><div className="info-grid"><span>Giáo viên hướng dẫn</span><b>Võ Thị Mỹ Ngà</b><span>Học sinh thực hiện</span><b>Nguyễn Anh Tuấn · Đỗ Thị Ánh Chinh</b><span>Lớp · Trường</span><b>12A2 · THPT Yên Lãng</b><span>Mục đích</span><b>Giáo dục phi thương mại</b></div><button className="button button-primary full-button" onClick={() => setShowInfo(false)}>Tiếp tục học <ArrowRight size={16} /></button></section></div>}
  </div>
}

function Overview({ onNavigate, onStart, drafts, onInfo }: { onNavigate: (tab: Tab) => void; onStart: (prompt?: typeof prompts[number]) => void; drafts: Draft[]; onInfo: () => void }) {
  const recent = drafts.slice(0, 2)
  return <div className="overview-page">
    <section className="hero-banner"><div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> MỘT KHÔNG GIAN ĐỂ NGHĨ VÀ VIẾT</div><h1>Ý tưởng lớn<br />bắt đầu từ <em>một trang giấy.</em></h1><p>Luyện viết nghị luận xã hội, khám phá dẫn chứng và tìm tiếng nói riêng của bạn — từng bước một.</p><div className="hero-buttons"><button className="button button-light" onClick={() => onStart()}><PenLine size={16} /> Bắt đầu viết <ArrowRight size={15} /></button><button className="button button-ghost" onClick={() => onNavigate('Kho đề')}>Khám phá kho đề <ArrowDown size={15} /></button></div><div className="hero-signature"><span className="signature-rule" /> Học để hiểu. Viết để trưởng thành.</div></div><div className="horizon-art" aria-hidden="true"><div className="sun-disc" /><div className="horizon-line" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="art-paper"><span>01 / 07</span><i /><i /><i /><i /><b>mở ra<br />một ý tưởng</b></div><div className="art-caption">CHÂN TRỜI TRI THỨC</div></div><div className="hero-number">01 <span>— 04</span></div></section>
    <section className="stats-row"><div className="stat-card"><span className="stat-icon stat-burgundy"><BookOpen size={18} /></span><div><b>100</b><span>đề nghị luận</span></div><small>20 chủ đề</small></div><div className="stat-card"><span className="stat-icon stat-green"><Lightbulb size={18} /></span><div><b>07</b><span>bước lập dàn ý</span></div><small>Rõ ý, chắc bài</small></div><div className="stat-card"><span className="stat-icon stat-gold"><Heart size={18} /></span><div><b>{evidence.length.toString().padStart(2, '0')}</b><span>dẫn chứng mẫu</span></div><small>Đa chiều, gần gũi</small></div><div className="stat-card"><span className="stat-icon stat-blue"><Clock3 size={18} /></span><div><b>{drafts.length.toString().padStart(2, '0')}</b><span>bài đang viết</span></div><small>Tự động lưu</small></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">BẮT ĐẦU TỪ ĐÂU?</span><h2>Chọn hành trình của bạn</h2></div><span className="section-aside">Một bước nhỏ hôm nay, một bài viết tốt hơn ngày mai.</span></div><div className="journey-grid"><button className="journey-card journey-featured" onClick={() => onNavigate('Kho đề')}><span className="journey-index">01 / KHÁM PHÁ</span><span className="journey-icon"><Search size={19} /></span><b>Tìm đề tài<br />đáng suy ngẫm</b><span className="journey-desc">100 đề bài · 20 chủ đề · 3 mức độ</span><span className="journey-link">Đến kho đề <ArrowRight size={15} /></span></button><button className="journey-card" onClick={() => onStart()}><span className="journey-index">02 / THỰC HÀNH</span><span className="journey-icon green-icon"><PenLine size={19} /></span><b>Viết nên<br />tiếng nói riêng</b><span className="journey-desc">Không gian viết tập trung, lưu tự động</span><span className="journey-link">Mở trang viết <ArrowRight size={15} /></span></button><button className="journey-card" onClick={() => onNavigate('Dẫn chứng')}><span className="journey-index">03 / TÍCH LŨY</span><span className="journey-icon gold-icon"><Lightbulb size={19} /></span><b>Gom nhặt<br />những câu chuyện</b><span className="journey-desc">Dẫn chứng thật để luận điểm thêm sức nặng</span><span className="journey-link">Xem dẫn chứng <ArrowRight size={15} /></span></button></div></section>
    <section className="lower-grid"><div className="quote-card"><div className="quote-mark">“</div><blockquote>Viết là cách ta nhìn thế giới chậm hơn, sâu hơn, và thành thật hơn.</blockquote><div className="quote-footer"><span className="quote-line" /> GÓC SUY NGẪM <button onClick={() => onInfo()}>Về dự án <ArrowRight size={13} /></button></div></div><div className="recent-card"><div className="recent-header"><div><span className="eyebrow">TIẾP TỤC HÀNH TRÌNH</span><h3>Bài viết gần đây</h3></div><button className="text-link" onClick={() => onNavigate('Bài nháp')}>Tất cả <ArrowRight size={14} /></button></div>{recent.length ? recent.map(draft => <button key={draft.id} className="recent-item" onClick={() => onStart(prompts.find(prompt => prompt.title === draft.title))}><span className="recent-file"><FileText size={16} /></span><span className="recent-copy"><b>{draft.title}</b><small>Cập nhật {new Date(draft.updatedAt).toLocaleDateString('vi-VN')}</small></span><ArrowRight size={15} /></button>) : <div className="empty-recent"><span className="empty-icon"><Bookmark size={17} /></span><p>Bài viết đầu tiên đang chờ bạn bắt đầu.</p><button className="text-link" onClick={() => onStart()}>Tạo bản nháp <ArrowRight size={14} /></button></div>}</div></section>
    <footer className="page-footer"><span>VĂN NGHỊ LUẬN LAB <i>·</i> HỌC ĐỂ HIỂU, VIẾT ĐỂ TRƯỞNG THÀNH</span><button onClick={onInfo}>Thông tin dự án</button></footer>
  </div>
}

function DraftsView({ drafts, onOpen, onDelete, onNew }: { drafts: Draft[]; onOpen: (draft: Draft) => void; onDelete: (id: string) => void; onNew: () => void }) {
  const sorted = useMemo(() => [...drafts].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)), [drafts])
  return <section className="content-page"><div className="page-intro"><div><span className="eyebrow">GÓC VIẾT CỦA BẠN</span><h1>Bài làm nháp</h1><p>Mỗi ý tưởng đều xứng đáng có thêm một lần được viết tiếp.</p></div><button className="button button-primary" onClick={onNew}><PenLine size={16} /> Bài viết mới</button></div>{sorted.length ? <div className="draft-grid">{sorted.map(draft => <article className="draft-card" key={draft.id}><div className="draft-card-top"><span className="draft-icon"><FileText size={18} /></span><button className="delete-draft" aria-label={`Xóa ${draft.title}`} onClick={() => onDelete(draft.id)}><X size={16} /></button></div><h3>{draft.title}</h3><p>{draft.body ? draft.body.slice(0, 130) : 'Bản nháp chưa có nội dung. Hãy tiếp tục viết những ý tưởng đầu tiên của bạn.'}</p><div className="draft-card-bottom"><span><Clock3 size={13} /> {new Date(draft.updatedAt).toLocaleDateString('vi-VN')}</span><button onClick={() => onOpen(draft)}>Viết tiếp <ArrowRight size={14} /></button></div></article>)}</div> : <div className="empty-state"><span><FileText size={25} /></span><h2>Trang viết đầu tiên đang chờ bạn</h2><p>Chọn một đề tài và bắt đầu gom những suy nghĩ của mình.</p><button className="button button-primary" onClick={onNew}>Bắt đầu viết <ArrowRight size={15} /></button></div>}</section>
}
