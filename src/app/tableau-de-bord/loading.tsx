export default function Loading() {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="relative py-10" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sand-400/20 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-sand-400/20 rounded-lg animate-pulse" />
              <div className="h-3 w-24 bg-sand-400/10 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex gap-1 mt-7">
            {[80, 100, 72, 88].map((w, i) => (
              <div key={i} className="h-8 rounded-xl bg-sand-400/20 animate-pulse" style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="h-10 w-10 rounded-xl bg-sand-100 animate-pulse mb-3" />
              <div className="h-6 w-24 bg-sand-100 rounded-lg animate-pulse mb-1" />
              <div className="h-3 w-32 bg-sand-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-card h-64 animate-pulse" />
      </div>
    </div>
  );
}
