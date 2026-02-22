import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LiveChat — Real-time chatroom',
  description: 'A minimal real-time chat app built with Next.js and NestJS WebSockets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
