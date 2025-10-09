'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useProduct } from '@/hooks/useShopware';
import { useCartContext } from '@/context/CartContext';
import { ShopwareProduct } from '@/types/shopware';
import Button from '@/components/ui/button/Button';

interface ProductDetailPageProps {
  productId: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  const { addToCart } = useCartContext();
  const { data: productData, isLoading, error } = useProduct(productId);

  // Handle both possible response formats
  const product = (productData as unknown as { product?: ShopwareProduct })?.product as ShopwareProduct;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart([
        {
          type: 'product',
          referencedId: product.id,
          quantity,
        },
      ]);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image skeleton */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
              
              {/* Product info skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ürün bulunamadı</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const productPrice = product?.calculatedPrice?.totalPrice || 0;
  const listPrice = product?.calculatedPrice?.listPrice?.price;
  const hasDiscount = listPrice && listPrice > productPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((listPrice - productPrice) / productPrice) * 100)
    : 0;

  const productImages = product?.media || [];
  const coverImage = product?.cover?.media;
  // Simplified image handling - use cover image first if available, then product media
  const allImages = coverImage ? [coverImage] : productImages.length > 0 ? productImages.map((img: unknown) => (img as { media?: { url?: string; id?: string } }).media).filter(Boolean) : [];
  const productName = (product?.translated?.name || product?.name) as string;
  const productDescription = (product?.translated?.description || product?.description) as string;
  const manufacturer = product?.manufacturer?.name;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-3 lg:space-y-4">
            {/* Main Image */}
            <div className="aspect-square max-h-[400px] lg:max-h-none bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              {allImages.length > 0 ? (
                <Image
                  src={(allImages[selectedImageIndex] as { url?: string })?.url || ''}
                  alt={productName}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 lg:w-24 lg:h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 lg:grid-cols-5 gap-1.5 lg:gap-2">
                {allImages.slice(0, 5).map((image: unknown, index: number) => {
                  const img = image as { id?: string; url?: string };
                  return (
                  <button
                    key={img.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white dark:bg-gray-800 rounded-md lg:rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-blue-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Image
                      src={img.url || ''}
                      alt={`${productName} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 20vw, 120px"
                    />
                  </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Manufacturer */}
            {manufacturer && (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {manufacturer}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {productName}
            </h1>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">(4.0) 24 reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(productPrice)}
                </span>
                {hasDiscount && listPrice && (
                  <>
                    <span className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(listPrice)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs lg:text-sm font-bold">
                      %{discountPercentage} Discount
                    </span>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.available ? `In Stock ${product.availableStock ? `(${product.availableStock} items)` : ''}` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Short Description */}
            {productDescription && (
              <div className="text-gray-600 dark:text-gray-400">
                <p className="text-sm lg:text-base">{typeof productDescription === 'string' ? productDescription.substring(0, 150) + '...' : ''}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Qty:
                </label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 lg:p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-3 lg:px-4 py-2 text-gray-900 dark:text-white min-w-[2.5rem] lg:min-w-[3rem] text-center text-sm lg:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 lg:p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 lg:gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  variant="primary"
                  className="flex-1 text-sm lg:text-base"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13h10m-10 0L7 13" />
                  </svg>
                  Add to Cart
                </Button>
                
                <Button variant="outline">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 lg:mt-16">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
                    selectedTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'description' && 'Description'}
                  {tab === 'specifications' && 'Specs'}
                  {tab === 'reviews' && 'Reviews'}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-4 lg:py-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  {(typeof productDescription === 'string' && productDescription) || 'Product description has not been added yet.'}
                </p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Product Number</h4>
                    <p className="text-gray-600 dark:text-gray-400">{product?.productNumber}</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Stock Status</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {product?.available ? `In Stock (${product?.availableStock} items)` : 'Out of Stock'}
                    </p>
                  </div>
                  {product?.weight && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Weight</h4>
                      <p className="text-gray-600 dark:text-gray-400">{product.weight}kg</p>
                    </div>
                  )}
                  {product?.tax && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Tax Rate</h4>
                      <p className="text-gray-600 dark:text-gray-400">{product.tax.taxRate}%</p>
                    </div>
                  )}
                  {product?.shippingFree && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Shipping</h4>
                      <p className="text-green-600 dark:text-green-400">Free Shipping</p>
                    </div>
                  )}
                  {manufacturer && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Manufacturer</h4>
                      <p className="text-gray-600 dark:text-gray-400">{manufacturer}</p>
                    </div>
                  )}
                </div>
                
                {/* Properties Section */}
                {product?.properties && product.properties.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Properties</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.properties.map((property: unknown) => {
                        const prop = property as { id?: string; name?: string };
                        return (
                          <span
                            key={prop.id}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                          >
                            {prop.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customer Reviews
                </h3>
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Henüz değerlendirme bulunmuyor. İlk değerlendirmeyi siz yapın!
                  </p>
                  <Button variant="outline" className="mt-4">
                    Değerlendirme Yap
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;