import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PeachWish 💖 | Share Love & Warm Celebrations',
  description: 'Create and share sweet, personalized surprise wish pages in beautiful warm peach and cream tones.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" rx="32" fill="%23FFEBE5"/><path d="M50,73 C48,73 24,53 24,36 C24,26 32,18 42,18 C47,18 50,21 50,21 C50,21 53,18 58,18 C68,18 76,26 76,36 C76,53 52,73 50,73 Z" fill="%23FF7A59"/></svg>',
  },
  openGraph: {
    title: 'PeachWish 💖 | Share Love & Warm Celebrations',
    description: 'Create and share sweet, personalized surprise wish pages in beautiful warm peach and cream tones.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PeachWish 💖 | Share Love & Warm Celebrations',
    description: 'Create and share sweet, personalized surprise wish pages in beautiful warm peach and cream tones.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1428022985258563" crossOrigin="anonymous"></script>
      </head>
      <body suppressHydrationWarning className="antialiased">{children}</body>
    </html>
  );
}
