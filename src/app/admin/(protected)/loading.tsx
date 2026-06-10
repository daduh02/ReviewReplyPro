export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-200"
          />
        ))}
      </section>
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-lg border border-slate-200 bg-slate-50"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
