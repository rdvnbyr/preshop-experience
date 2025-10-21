"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

const CheckoutCompletedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-8">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Siparişiniz Alındı!
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Siparişiniz başarıyla oluşturuldu. Kısa süre içinde size ulaşacağız.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/shop">
              <Button variant="primary">Alışverişe Devam Et</Button>
            </Link>
            <Button variant="outline">Siparişlerimi Görüntüle</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCompletedPage;
