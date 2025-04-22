import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { AppHeader } from './app-header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-200 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-900">
        <AppHeader />
        <div className="p-6">
          {children}
          <footer className="text-center text-slate-500 text-sm py-6">
            <p>© {new Date().getFullYear()} CryptoTrack API • Backend Documentation</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
