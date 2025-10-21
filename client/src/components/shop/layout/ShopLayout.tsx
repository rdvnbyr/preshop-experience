"use client";

import React from "react";
import ShopHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";
import CartSidebar from "../cart/CartSidebar";

interface ShopLayoutProps {
  children: React.ReactNode;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ShopHeader />
      <main className="flex-1">{children}</main>
      <ShopFooter />
      <CartSidebar />
    </div>
  );
};

export default ShopLayout;
