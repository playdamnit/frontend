import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="relative overflow-hidden aspect-[4/3] border border-quokka-purple/10 bg-quokka-dark/80 select-none cursor-default hover:cursor-grab">
      {/* Gradient background simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-quokka-darker to-quokka-dark opacity-50" />

      {/* Content */}
      <div className="relative h-full p-4 flex gap-6">
        {/* Game cover image skeleton */}
        <div className="relative w-1/2 flex-shrink-0 rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full rounded-lg bg-quokka-purple/10" />

          {/* Rating badge skeleton */}
          <div className="absolute bottom-2 left-2">
            <Skeleton className="h-6 w-12 rounded-full bg-quokka-purple/10" />
          </div>
        </div>

        {/* Game information skeleton */}
        <div className="flex-1 flex flex-col gap-3">
          <Skeleton className="h-7 w-4/5 bg-quokka-purple/10" />

          <div className="space-y-3 flex-1">
            {/* Date skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full bg-quokka-purple/10" />
              <Skeleton className="h-4 w-24 bg-quokka-purple/10" />
            </div>

            {/* Platform skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full bg-quokka-purple/10" />
              <Skeleton className="h-4 w-32 bg-quokka-purple/10" />
            </div>

            {/* Summary skeleton */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-full bg-quokka-purple/10" />
              <Skeleton className="h-3 w-5/6 bg-quokka-purple/10" />
              <Skeleton className="h-3 w-4/6 bg-quokka-purple/10" />
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <Skeleton className="h-6 w-16 rounded-full bg-quokka-purple/10" />
            <Skeleton className="h-6 w-20 rounded-full bg-quokka-purple/10" />
            <Skeleton className="h-6 w-14 rounded-full bg-quokka-purple/10" />
          </div>
        </div>
      </div>

      {/* Gradient line at bottom */}
      <div className="h-1 w-1/3 bg-gradient-to-r from-quokka-purple/20 via-quokka-cyan/20 to-quokka-purple/20 absolute bottom-0 left-0"></div>
    </Card>
  );
};

export default SkeletonCard;
