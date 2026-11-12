import { Link } from 'react-router'

type PlaceholderPageProps = {
  title: string
  links?: { to: string; label: string }[]
}

// UI 작업(#7) 전까지 제목과 이동 링크만 있는 뼈대 화면
export default function PlaceholderPage({ title, links = [] }: PlaceholderPageProps) {
  return (
    <section className="card">
      <h1>{title}</h1>
      <p className="muted">화면 준비 중입니다.</p>
      <div className="chips">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="button">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
