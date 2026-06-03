import { ListingsGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="relative py-10" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-64 bg-sand-400/20 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-48 bg-sand-400/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-24 flex-shrink-0 bg-white rounded-xl border border-sand-100 animate-pulse" />
          ))}
        </div>
        <ListingsGridSkeleton count={8} />
      </div>
    </div>
  );
}
