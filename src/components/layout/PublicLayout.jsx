import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader.jsx';
import PublicFooter from './PublicFooter.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';
import DevToolbar from './DevToolbar.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <PublicHeader />
      <main className="flex-1 w-full pt-16 sm:pt-20">
        <Outlet />
      </main>
      <PublicFooter />
      <MobileBottomNav />
      <DevToolbar />
    </div>
  );
}
