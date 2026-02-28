import dynamic from 'next/dynamic'

const VisualBanner = dynamic(() => import('@/lib/components/common/VisualBanner').then((m) => m.VisualBanner), {
  loading: () => (
    <div className="relative aspect-[9/14] w-full animate-pulse overflow-hidden bg-gradient-to-br from-slate-300/85 via-slate-200/90 to-slate-300/85 shadow-inner sm:aspect-[4/5] md:aspect-[3/2] xl:aspect-[120/41]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="mx-auto flex h-full w-full max-w-screen-xl items-center px-6 sm:px-10 md:px-14 xl:px-24">
        <div className="flex w-full max-w-[62%] flex-col justify-center gap-3">
          <div className="h-8 w-4/5 rounded-md bg-white/70 shadow-md sm:h-10 md:h-12" />
          <div className="h-4 w-3/5 rounded bg-white/60 shadow sm:h-5" />
          <div className="h-9 w-24 rounded-full bg-white/75 shadow-md sm:h-10 sm:w-28" />
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 h-10 w-44 -translate-x-1/2 rounded-full bg-black/20 shadow-inner sm:bottom-5 sm:h-12 sm:w-56" />
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-slate-400/80 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-slate-400/80 to-transparent" />
    </div>
  ),
})

const ProductList = dynamic(() => import('@/lib/components/common/ProductList').then((m) => m.ProductList), {
  loading: () => (
    <div className="mx-auto mt-4 box-border min-w-[calc(360px-20px)] animate-pulse rounded-t-[2rem] bg-white pb-4 pt-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] md:mt-0 md:w-auto md:bg-transparent md:shadow-none">
      <div className="md:container md:mx-auto">
        <ul className="mx-auto box-border grid grid-cols-6 gap-3 px-8 pt-5 md:w-fit md:grid-cols-8 md:rounded-lg md:bg-white md:p-5 lg:grid-cols-10 xl:grid-cols-12">
          {Array.from({ length: 12 }, (_, i) => (
            <li key={`category-loading-${i}`} className="mx-auto w-fit">
              <div className="mx-auto mb-1 h-[42px] w-[42px] rounded-lg bg-slate-200 shadow-sm" />
              <div className="mx-auto h-3 w-10 rounded bg-slate-200" />
            </li>
          ))}
        </ul>
      </div>

      <section className="container box-border w-full bg-white sm:mx-auto md:mt-4 md:bg-transparent">
        <ul className="mx-4 my-4 box-border grid grid-cols-2 gap-y-1 sm:grid-cols-3 md:m-0 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => (
            <li key={`product-list-loading-${i}`} className="p-5">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                <div className="absolute left-3 top-3 h-3 w-12 rounded bg-white/65 shadow sm:h-4 sm:w-16" />
                <div className="absolute left-3 top-8 h-4 w-4/6 rounded bg-white/70 shadow sm:top-10 sm:h-5" />
                <div className="absolute bottom-4 left-3 h-6 w-14 rounded bg-white/75 shadow sm:h-8 sm:w-16" />
                <div className="absolute bottom-4 right-3 flex flex-col gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/70 shadow" />
                  <div className="h-8 w-8 rounded-full bg-white/70 shadow" />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex h-24 w-full items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-slate-400" />
        </div>
      </section>
    </div>
  ),
})

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
