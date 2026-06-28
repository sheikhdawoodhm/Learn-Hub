function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />

      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />

        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  );
}

export default CourseCardSkeleton;