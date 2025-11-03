'use client';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${className}`}
            style={{
              width: width || (i === lines - 1 ? '60%' : '100%'),
              height: height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={`${baseClasses} ${className}`}
        style={{
          width: width || height || '2rem',
          height: height || width || '2rem',
          borderRadius: '50%',
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${className}`} style={{ width, height }}>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={{ width, height }}
    />
  );
}

// Pre-built skeleton components for common use cases
export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <LoadingSkeleton variant="rectangular" height="200px" className="w-full" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton variant="text" lines={2} width="100%" />
        <LoadingSkeleton variant="text" lines={1} width="60%" />
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="border-l-2 border-gray-200 pl-4 space-y-3">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="circular" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" lines={1} width="120px" />
          <LoadingSkeleton variant="text" lines={2} />
        </div>
      </div>
    </div>
  );
}

export function CommentsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <LoadingSkeleton key={i} height="20px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} height="40px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <LoadingSkeleton variant="circular" width="80px" height="80px" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" lines={1} width="200px" />
          <LoadingSkeleton variant="text" lines={1} width="150px" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingSkeleton variant="card" height="200px" />
        <LoadingSkeleton variant="card" height="200px" />
      </div>
    </div>
  );
}

