"use client";

import React from "react";
import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import Button from "@/components/ui/button/Button";

const CartSidebar: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartItem,
    removeFromCart,
    itemCount,
    totalPrice,
  } = useCartContext();

  const handleQuantityChange = async (
    lineItemId: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) {
      await removeFromCart([lineItemId]);
    } else {
      await updateCartItem(lineItemId, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Cart ({itemCount})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!cart || cart.lineItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg
                  className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13h10m-10 0L7 13"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  Your cart is empty
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  Add products to start shopping
                </p>
                <Button onClick={() => setIsCartOpen(false)} variant="primary">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {item.cover?.url ? (
                          <img
                            src={item.cover.url}
                            alt={item.label}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatPrice(item.price?.unitPrice || 0)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-l-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-12 h-8 border-t border-b border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-r-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart([item.id])}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Total Price */}
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                        Total: {formatPrice(item.price?.totalPrice || 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.lineItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/shop/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block"
                >
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link
                  href="/shop/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block"
                >
                  <Button variant="primary" className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
