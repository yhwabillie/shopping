import { ProductList } from '@/lib/components/common/ProductList'
import { VisualBanner } from '@/lib/components/common/VisualBanner'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        상품 리스트 본문
      </h2>

      <VisualBanner />
      <ProductList />
    </section>
  )
}
