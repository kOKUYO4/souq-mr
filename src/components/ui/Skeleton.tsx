"use client";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

function Skeleton({ className = "", rounded = "lg" }: SkeletonProps) {
  const r = { sm: "rounded", md: "rounded-lg", lg: "rounded-xl", full: "rounded-full" }[rounded];
  return (
    <div
      className={`bg-sand-200 ${r} ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, #EBD9B0 25%, #F5EDD9 50%, #EBD9B0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s linear infinite",
      }}
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="w-full h-48" rounded="sm" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-sand-100">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7" rounded="full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ListingsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      <div className="flex items-center gap-5">
        <Skeleton className="w-24 h-24" rounded="lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-5">
        <Skeleton className="w-full h-96" rounded="lg" />
        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
          <Skeleton className="h-12 w-full" rounded="md" />
          <Skeleton className="h-10 w-full" rounded="md" />
          <Skeleton className="h-10 w-full" rounded="md" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
