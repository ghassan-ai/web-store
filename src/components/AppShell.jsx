'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar/Navbar';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import Footer from '@/components/Footer/Footer';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

function StatusBar() {
  return (
    <div className="h-7 bg-primary-dark flex items-center justify-between px-4 sm:px-6 text-xs text-text-secondary select-none">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent status-pulse" />
        <span className="font-tajawal text-[11px]">لبنان فون ستور</span>
      </div>
      <div className="flex items-center gap-1">
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-text-secondary">
          <rect x="0.5" y="1.5" width="14" height="7" rx="1.5" stroke="currentColor" strokeWidth="1"/>
          <rect x="15" y="3.5" width="2" height="3" rx="0.5" fill="currentColor"/>
          <rect x="2" y="3" width="11" height="4" rx="0.5" fill="currentColor" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative z-10 min-h-screen flex flex-col font-tajawal">
      <div className="flex flex-col min-h-screen bg-primary">
        <StatusBar />
        <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}
