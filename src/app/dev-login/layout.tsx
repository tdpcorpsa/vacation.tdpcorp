import { notFound } from 'next/navigation'

const isProd = process.env.NODE_ENV === 'production'

export default function DevLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isProd) {
    notFound()
  }

  return <div>{children}</div>
}
