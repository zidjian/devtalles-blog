import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded ${className}`}
        />
    );
};

// Post Content Skeleton
export const PostSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full" />
            </div>

            {/* Content */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Code block */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full rounded" />
            </div>

            {/* More content */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    );
};

// Comments Skeleton
export const CommentsSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Comment form skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Comments list skeleton */}
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="space-y-3 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Related Posts Skeleton
export const RelatedPostsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                    {/* Image skeleton */}
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />

                    {/* Content skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Table of Contents Skeleton
export const TableOfContentsSkeleton: React.FC = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
    );
};
