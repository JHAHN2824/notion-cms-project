import Link from "next/link"

const FOOTER_LINKS = [
  { href: "https://nextjs.org/docs", label: "Next.js 문서" },
  { href: "https://ui.shadcn.com", label: "shadcn/ui" },
  { href: "https://tailwindcss.com/docs", label: "Tailwind CSS" },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>&copy; {new Date().getFullYear()} 스타터 킷. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
