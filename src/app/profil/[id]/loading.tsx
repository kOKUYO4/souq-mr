import { ProfileSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-sand-50">
      <ProfileSkeleton />
    </div>
  );
}
