import React from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'CreativeRadar AI | Multimodal Ad Intelligence Platform',
  description: 'Production-Ready Multimodal AI Ad Library Intelligence Platform for Dream Games & Mobile Gaming Giants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-white/5 py-6 bg-slate-950/60 text-center text-xs text-slate-500">
          <p>© 2026 CreativeRadar AI Platform. Built for Mobile Game Growth Teams & Executive Decision Makers.</p>
        </footer>
      </body>
    </html>
  );
}
