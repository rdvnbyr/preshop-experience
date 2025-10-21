"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/hooks/useShopware";
import { ShopwareCart, ShopwareCartLineItemRequest } from "@/types/shopware";
import shopwareApi from "@/services/shopware";

interface CartContextType {
  cart: ShopwareCart | null;
  isLoading: boolean;
  error: Error | null;
  itemCount: number;
  totalPrice: number;
  addToCart: (items: ShopwareCartLineItemRequest[]) => Promise<void>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemIds: string[]) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [contextToken, setContextToken] = useState<string | null>(null);

  // Initialize context token on mount
  useEffect(() => {
    const initializeContext = async () => {
      try {
        const token = await shopwareApi.createContext();
        setContextToken(token);
        // Store in localStorage for persistence
        localStorage.setItem("sw-context-token", token);
      } catch (error) {
        console.error("Failed to initialize Shopware context:", error);
      }
    };

    // Check if we have a stored token
    const storedToken = localStorage.getItem("sw-context-token");
    if (storedToken) {
      shopwareApi.setContextToken(storedToken);
      setContextToken(storedToken);
    } else {
      initializeContext();
    }
  }, []);

  const { data: cartData, isLoading, error } = useCart();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  const cart = cartData?.data || null;
  const itemCount =
    cart?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const totalPrice = cart?.price?.totalPrice || 0;

  const addToCart = async (items: ShopwareCartLineItemRequest[]) => {
    try {
      await addToCartMutation.mutateAsync(items);
      setIsCartOpen(true); // Open cart panel when item is added
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (lineItemId: string, quantity: number) => {
    try {
      await updateCartItemMutation.mutateAsync({ lineItemId, quantity });
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const removeFromCart = async (lineItemIds: string[]) => {
    try {
      await removeFromCartMutation.mutateAsync(lineItemIds);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  };

  const contextValue: CartContextType = {
    cart,
    isLoading,
    error,
    itemCount,
    totalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
