import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'galcocastats - GitHub Stats',
  description: 'Personal GitHub statistics cards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
