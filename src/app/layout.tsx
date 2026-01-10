import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galcoca Stats | Beautiful GitHub Statistics Cards',
  description:
    'Generate beautiful, customizable SVG cards displaying your GitHub statistics. 14 themes, 4 card types. Fork and deploy your own instance.',
  keywords: ['github', 'stats', 'statistics', 'cards', 'svg', 'readme', 'profile'],
  authors: [{ name: 'Gabriel Corredor', url: 'https://github.com/galcoca' }],
  openGraph: {
    title: 'Galcoca Stats | Beautiful GitHub Statistics Cards',
    description: 'Generate beautiful, customizable SVG cards displaying your GitHub statistics.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
