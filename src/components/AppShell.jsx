'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar/Navbar';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import Footer from '@/components/Footer/Footer';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

const AmbientBackground = dynamic(
  () => import('@/components/AmbientBackground/AmbientBackground'),
  { ssr: false }
);


export default function AppShell({ children }) {
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <AmbientBackground />
      <div className="relative z-10 min-h-screen flex flex-col font-tajawal">
        <div className="flex flex-col min-h-screen">
          <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </div>
    </>
  );
}
