export default function Loading() {
  return (
    <section aria-label="page loading skeleton" className="animate-pulse">
      <div className="aspect-[9/14] w-full bg-gray-200/70 sm:aspect-[4/5] md:aspect-[3/2] xl:aspect-[120/41]" />

      <div className="mx-auto mt-4 box-border min-w-[calc(360px-20px)] rounded-t-[2rem] bg-white pb-4 pt-4 drop-shadow-2xl md:mt-0 md:w-auto md:bg-transparent">
        <div className="mx-4 mb-4 h-10 rounded-full bg-gray-200 md:container md:mx-auto" />

        <div className="container">
          <ul className="mx-4 my-4 grid grid-cols-2 gap-0 sm:grid-cols-3 md:mx-0 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <li key={`loading-card-${i}`} className="p-5">
                <div className="aspect-[2/3] w-full rounded-2xl bg-gray-200" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
