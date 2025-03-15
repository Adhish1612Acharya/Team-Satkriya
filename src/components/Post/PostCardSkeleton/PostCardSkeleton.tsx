import { Skeleton } from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <div className="mb-6 overflow-hidden">
      {/* Card Header Skeleton */}
      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar Skeleton */}
            <Skeleton variant="circular" width={40} height={40} />
            <div>
              {/* Name Skeleton */}
              <Skeleton variant="text" width={100} height={20} />
              {/* Role and Date Skeleton */}
              <Skeleton variant="text" width={80} height={16} />
            </div>
          </div>
          {/* More Options Skeleton */}
          <Skeleton variant="circular" width={24} height={24} />
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-6 pb-3">
        {/* Post Content Skeleton */}
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />

        {/* Media Skeleton */}
        <Skeleton variant="rectangular" width="100%" height={200} className="mt-4 rounded-md" />
      </div>

      {/* Card Footer Skeleton */}
      <div className="p-6 pt-0">
        {/* Likes and Comments Skeleton */}
        <div className="flex items-center justify-between pb-3">
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-between py-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} variant="text" width={80} height={30} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;