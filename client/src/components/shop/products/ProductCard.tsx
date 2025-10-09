'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShopwareProduct } from '@/types/shopware';
import { useCartContext } from '@/context/CartContext';
import Button from '@/components/ui/button/Button';

interface ProductCardProps {
  product: ShopwareProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleAddToCart = async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    try {
      await addToCart([
        {
          type: 'product',
          referencedId: product.id,
          quantity: 1,
        },
      ]);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const productPrice = product.calculatedPrice?.totalPrice || 0;
  const listPrice = product.calculatedPrice?.listPrice?.price;
  const hasDiscount = listPrice && listPrice !== productPrice;
  const discountPercentage = hasDiscount && listPrice
    ? Math.round(Math.abs((listPrice - productPrice) / listPrice) * 100)
    : 0;

  const productImage = product.cover?.url || product.cover?.media?.url || product.media?.[0]?.url || product.media?.[0]?.media?.url;
  const productName = (product.translated?.name || product.name) as string;
  const manufacturer = product.manufacturer?.name;

  return (
    <Link href={`/shop/product/${product.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              %{discountPercentage} OFF
            </div>
          )}

          {/* Stock Status */}
          {!product.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Manufacturer */}
          {manufacturer && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {manufacturer}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {productName}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(productPrice)}
            </span>
            {hasDiscount && listPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(listPrice)}
              </span>
            )}
          </div>

          {/* Rating (placeholder - would need rating data from API) */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(4.0)</span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.available}
            variant="primary"
            size="sm"
            className="w-full"
          >
            {product.available ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13h10m-10 0L7 13" />
                </svg>
                Add to Cart
              </>
            ) : (
              'Out of Stock'
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;