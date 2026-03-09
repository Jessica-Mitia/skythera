import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from './GlassCard';

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Skeleton className="h-6 w-32 mx-auto mb-4 bg-white/20" />
        <Skeleton className="h-24 w-40 mx-auto mb-4 bg-white/20" />
        <Skeleton className="h-6 w-24 mx-auto mb-2 bg-white/20" />
        <Skeleton className="h-4 w-20 mx-auto bg-white/20" />
      </div>

      <GlassCard>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
              <Skeleton className="h-4 w-10 bg-white/20" />
              <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
              <Skeleton className="h-4 w-8 bg-white/20" />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-12 bg-white/20" />
              <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
              <Skeleton className="h-2 flex-1 bg-white/20 rounded-full" />
              <Skeleton className="h-4 w-16 bg-white/20" />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard key={i}>
            <Skeleton className="h-4 w-16 mb-2 bg-white/20" />
            <Skeleton className="h-8 w-12 bg-white/20" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
