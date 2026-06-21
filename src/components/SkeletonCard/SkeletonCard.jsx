'use client';

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse bg-surface-card border border-surface-border">
    <div className="aspect-square bg-slate-100" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-slate-100 rounded w-2/3" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="h-5 bg-slate-100 rounded w-1/4" />
    </div>
  </div>
);

export default SkeletonCard;
