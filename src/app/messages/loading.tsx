export default function Loading() {
  return (
    <div className="min-h-screen bg-sand-50 flex">
      {/* Sidebar skeleton */}
      <div className="w-80 bg-white border-r border-sand-100 p-4 space-y-3 hidden sm:block">
        <div className="h-10 bg-sand-50 rounded-xl animate-pulse mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-11 h-11 rounded-full bg-sand-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-sand-100 rounded animate-pulse" />
              <div className="h-2 w-3/4 bg-sand-50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      {/* Chat skeleton */}
      <div className="flex-1 bg-sand-50 flex flex-col">
        <div className="p-4 bg-white border-b border-sand-100">
          <div className="h-5 w-40 bg-sand-100 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
              <div className="w-8 h-8 rounded-full bg-sand-200 animate-pulse flex-shrink-0" />
              <div className={`h-10 rounded-2xl bg-sand-200 animate-pulse ${i % 2 === 0 ? "w-48" : "w-36"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
