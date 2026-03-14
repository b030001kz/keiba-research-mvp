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
        <body className="bg-[#0B1120] text-slate-300 min-h-screen flex flex-col md:flex-row font-sans antialiased selection:bg-blue-500/30">
          
          {/* Subtle Global Glow */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.15),rgba(255,255,255,0))]"></div>

          {/* Mobile Header (Hidden on Desktop) */}
          <header className="md:hidden flex items-center justify-between p-4 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center gap-2 tracking-tight">
              <TrendingUp className="text-blue-400" size={20} /> Keiba<span className="font-light">Research</span>
            </h1>
            <UserButton />
          </header>

          {/* Desktop Sidebar (Hidden on Mobile) */}
          <aside className="hidden md:flex w-72 h-screen sticky top-0 flex-col p-6 shrink-0 z-10 border-r border-white/5 bg-[#0F172A]/50 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0F172A]/20">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center gap-3 tracking-tighter">
                <TrendingUp className="text-blue-500" strokeWidth={3} /> Keiba<span className="font-light text-slate-400">Research</span>
              </h1>
            </div>
            
            <nav className="flex-1 flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-slate-400 font-medium group">
                <LayoutDashboard size={22} className="group-hover:text-blue-400 transition-colors" /> 
                <span>Dashboard</span>
              </Link>
              <Link href="/races" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-slate-400 font-medium group">
                <List size={22} className="group-hover:text-amber-400 transition-colors" /> 
                <span>Race List</span>
              </Link>
              <Link href="/backtest" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-slate-400 font-medium group">
                <TrendingUp size={22} className="group-hover:text-emerald-400 transition-colors" /> 
                <span>Backtest</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-slate-400 font-medium group">
                <Settings size={22} className="group-hover:text-purple-400 transition-colors" /> 
                <span>Settings</span>
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4 px-2">
              <UserButton />
              <div className="text-xs text-slate-500 font-medium">Account Settings</div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 w-full max-w-7xl mx-auto z-0 transition-all duration-300">
            {children}
          </main>

          {/* Mobile Bottom Navigation (Hidden on Desktop) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center p-3 z-50 safe-area-pb">
            <Link href="/" className="flex flex-col items-center text-slate-500 hover:text-blue-400 transition-colors">
              <LayoutDashboard size={24} />
              <span className="text-[10px] mt-1.5 font-bold tracking-wider">HOME</span>
            </Link>
            <Link href="/races" className="flex flex-col items-center text-slate-500 hover:text-amber-400 transition-colors">
              <List size={24} />
              <span className="text-[10px] mt-1.5 font-bold tracking-wider">RACES</span>
            </Link>
            <Link href="/backtest" className="flex flex-col items-center text-slate-500 hover:text-emerald-400 transition-colors">
              <TrendingUp size={24} />
              <span className="text-[10px] mt-1.5 font-bold tracking-wider">TEST</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center text-slate-500 hover:text-purple-400 transition-colors">
              <Settings size={24} />
              <span className="text-[10px] mt-1.5 font-bold tracking-wider">SET</span>
            </Link>
          </nav>
        </body>
      </html>
    </ClerkProvider>
  );
}
