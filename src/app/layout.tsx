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
        <body className="bg-slate-900 text-slate-100 min-h-screen flex flex-col md:flex-row">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <header className="md:hidden flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 sticky top-0 z-40 shadow-sm">
            <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <TrendingUp /> keiba-research
            </h1>
            <UserButton />
          </header>

          {/* Desktop Sidebar (Hidden on Mobile) */}
          <aside className="hidden md:flex w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0 flex-col p-4 shadow-lg shrink-0">
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
          <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
            {children}
          </main>

          {/* Mobile Bottom Navigation (Hidden on Desktop) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around items-center p-2 z-50 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <Link href="/" className="flex flex-col items-center text-slate-400 hover:text-blue-400 p-2">
              <LayoutDashboard size={20} />
              <span className="text-[10px] mt-1 font-medium">ダッシュ</span>
            </Link>
            <Link href="/races" className="flex flex-col items-center text-slate-400 hover:text-blue-400 p-2">
              <List size={20} />
              <span className="text-[10px] mt-1 font-medium">レース</span>
            </Link>
            <Link href="/backtest" className="flex flex-col items-center text-slate-400 hover:text-blue-400 p-2">
              <TrendingUp size={20} />
              <span className="text-[10px] mt-1 font-medium">テスト</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center text-slate-400 hover:text-blue-400 p-2">
              <Settings size={20} />
              <span className="text-[10px] mt-1 font-medium">設定</span>
            </Link>
          </nav>
        </body>
      </html>
    </ClerkProvider>
  );
}
