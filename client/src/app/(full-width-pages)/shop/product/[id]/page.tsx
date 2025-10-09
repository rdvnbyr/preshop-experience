import ProductDetailPage from '@/components/shop/pages/ProductDetailPage';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductRoute({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}