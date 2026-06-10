export default function AppLoading() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-200"
          />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-200"
          />
        ))}
      </section>
    </div>
  );
}
