import ShopLayout from '@/components/shop/layout/ShopLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopLayout>{children}</ShopLayout>;
}