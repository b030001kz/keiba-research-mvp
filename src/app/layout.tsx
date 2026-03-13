import React from 'react';
import { LayoutDashboard, List, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

import { ClerkProvider, UserButton } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="bg-slate-900 text-slate-100 min-h-screen">
          <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0 flex flex-col p-4">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                  <TrendingUp /> keiba-research
                </h1>
                <UserButton />
              </div>
              <nav className="flex-1 flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <LayoutDashboard size={20} /> ダッシュボード
                </Link>
                <Link href="/races" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <List size={20} /> 対象レース一覧
                </Link>
                <Link href="/backtest" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <TrendingUp size={20} /> バックテスト
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <Settings size={20} /> 設定
                </Link>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
