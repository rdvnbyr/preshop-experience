import CategoryPage from "@/components/shop/pages/CategoryPage";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryRoute({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryPage categorySlug={slug} />;
}
