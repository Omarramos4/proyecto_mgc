
'use client';

import "../globals.css";
import { DM_Sans } from 'next/font/google';
import { lazy, Suspense } from 'react';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { ApolloWrapper } from '../ApolloWrapper';

// Lazy load del Sidebar para mejorar LCP
const Sidebar = lazy(() => import('../../componentes/Sidebar'));

const dm_sans = DM_Sans({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    fallback: ['system-ui', 'arial'],
});

// Loading component para el Sidebar
const SidebarSkeleton = () => (
  <div className="fixed left-0 top-0 h-full w-20 bg-gray-800 animate-pulse">
    <div className="p-4">
      <div className="h-8 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Este componente utiliza el contexto y se asegura de que el Sidebar y el main estén en el mismo nivel
const LayoutContent = ({ children }) => {
  const { isSidebarExpanded, toggleSidebar } = useSidebar();
  
  const expandedWidth = "256px"; // w-64
  const collapsedWidth = "80px";  // w-20
  const mainMarginLeft = isSidebarExpanded ? expandedWidth : collapsedWidth;

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </Suspense>
      <main 
        className="flex-grow p-4 transition-all duration-300" 
        style={{ marginLeft: mainMarginLeft }}
      >
        {children}
      </main>
    </div>
  );
};

export default function RootLayout({ children }) {
  return (
    <div className={dm_sans.className}>
      <ApolloWrapper>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </ApolloWrapper>
    </div>
  );
}
