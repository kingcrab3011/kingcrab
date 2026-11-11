import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Check, ChevronDown, Clock3, LoaderCircle, Sparkles } from 'lucide-react'
import type { Prompt } from '../data'

type Draft = { id: string; title: string; body: string; updatedAt: string }
export default function EssayWorkspace({ prompt, draft, onUpdate, onChoosePrompt }: { prompt: Prompt; draft?: Draft; onUpdate: (body: string, title?: string) => void; onChoosePrompt: () => void }) {
  const [text, setText] = useState(draft?.body || '')
  const [font, setFont] = useState('Lora')
  const [goal, setGoal] = useState(600)
  const [grade, setGrade] = useState<any>(null)
  const [grading, setGrading] = useState(false)
  const [saved, setSaved] = useState(true)
  const words = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text])
  const characters = text.length
  useEffect(() => { setText(draft?.body || ''); setGrade(null) }, [draft?.id, prompt.id])
  useEffect(() => {
    if (!text.trim()) { setSaved(true); return }
    setSaved(false)
    const timeout = window.setTimeout(() => { onUpdate(text, prompt.title); setSaved(true) }, 700)
    return () => window.clearTimeout(timeout)
  }, [text, prompt.title])
  const handleGrade = async () => {
    if (words < 35) { setGrade({ error: 'Hãy viết thêm một chút trước khi gửi bài chấm nhé.' }); return }
    setGrading(true); setGrade(null)
    try {
      const response = await fetch('/api/ai/grade-essay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ essayText: text, promptTitle: prompt.title, promptContent: prompt.quote, mode: 'practice', depth: 'detailed' }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || result.message || 'Chưa thể chấm bài lúc này.')
      setGrade(result.data || result)
    } catch (error) { setGrade({ error: error instanceof Error ? error.message : 'Chưa thể kết nối với AI.' }) } finally { setGrading(false) }
  }
  const outline = ['Mở bài', 'Giải thích vấn đề', 'Hệ thống luận điểm', 'Dẫn chứng tiêu biểu', 'Phản biện & mở rộng', 'Bài học nhận thức', 'Kết bài']
  return <section className="content-page"><div className="page-intro"><div><span className="eyebrow">BÀN VIẾT CỦA BẠN</span><h1>Luyện viết</h1><p>Tập trung vào ý tưởng. Bản nháp được lưu tự động trên thiết bị này.</p></div><button className="text-link" onClick={onChoosePrompt}>Đổi đề bài <ChevronDown size={15} /></button></div><div className="editor-layout"><section className="editor-panel"><div className="editor-toolbar"><div><h2 className="editor-title">{prompt.title}</h2><div className="editor-meta"><BookOpen size={13} /> Nghị luận xã hội <span>·</span>{prompt.topic}</div></div><div className="editor-controls"><span className="saved-status">{saved ? <Check size={12} /> : <Clock3 size={12} />}{saved ? 'Đã lưu' : 'Đang lưu'}</span><select aria-label="Phông chữ" value={font} onChange={event => setFont(event.target.value)}><option>Lora</option><option>Be Vietnam Pro</option></select></div></div><div className="editor-prompt"><span>ĐỀ BÀI · {String(prompt.id).padStart(2, '0')}</span><p>{prompt.quote}</p></div><textarea className="essay-input" aria-label="Nội dung bài viết" style={{ fontFamily: font === 'Lora' ? 'Lora, serif' : 'Be Vietnam Pro, sans-serif' }} placeholder="Mở đầu bằng một suy nghĩ của riêng bạn…\n\nBạn có thể viết tự do trước, chỉnh sửa sau. Những ý tưởng chưa hoàn thiện cũng xứng đáng được ghi lại." value={text} onChange={event => { setText(event.target.value); setGrade(null) }} /><div className="editor-footer"><span><b>{words}</b> từ <span>·</span> {characters} ký tự</span><label className="goal-control">Mục tiêu <select aria-label="Mục tiêu số từ" value={goal} onChange={event => setGoal(Number(event.target.value))}><option value={200}>200 từ</option><option value={600}>600 từ</option></select></label><span className="goal-track" aria-label={`${Math.min(100, Math.round(words / goal * 100))}% mục tiêu`}><i style={{ width: `${Math.min(100, Math.round(words / goal * 100))}%` }} /></span></div><button className="button button-primary grade-button" onClick={handleGrade} disabled={grading}>{grading ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={15} />}{grading ? 'Đang đọc bài viết…' : 'Nhận góp ý từ AI'} </button>{grade && <div className="grade-result" role="status">{grade.error ? <><h4>Chưa thể chấm bài</h4><p>{grade.error}</p></> : <><div className="score">{grade.overallScore ?? grade.score ?? '—'}<small> / 10 · {grade.performanceLevel || 'Gợi ý tham khảo'}</small></div><h4>{grade.generalAssessment || 'Một vài gợi ý cho bài viết của bạn'}</h4>{(grade.strengths || []).slice(0,2).map((item: string) => <p key={item}>✓ {item}</p>)}{(grade.priorityImprovements || []).slice(0,2).map((item: string) => <p key={item}>→ {item}</p>)}<small>{grade.disclaimer || 'Nhận xét AI chỉ mang tính tham khảo, phục vụ quá trình tự học.'}</small></>}</div>}</section><aside className="outline-panel"><span className="eyebrow">KHUNG BÀI VIẾT</span><h3>Dàn ý 7 bước</h3>{outline.map((label,index) => <div className="outline-step" key={label}><span className="outline-letter">{String.fromCharCode(65 + index)}</span><p><b>{label}</b><br />{prompt.outline[index]}</p></div>)}<div className="outline-tip"><b>Một gợi ý nhỏ</b><br />Hãy dùng dẫn chứng để soi sáng luận điểm, đừng để câu chuyện lấn át suy nghĩ của bạn.</div></aside></div></section>
}
