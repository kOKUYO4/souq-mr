import { ListingsGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ListingsGridSkeleton count={8} />
      </div>
    </div>
  );
}
