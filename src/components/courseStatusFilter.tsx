import { ChevronDown } from "lucide-react";

interface CourseStatusFilterProps {
  selectedStatus: string;
  setSelectedStatus: React.Dispatch<
    React.SetStateAction<string>
  >;
}

function CourseStatusFilter({
  selectedStatus,
  setSelectedStatus,
}: CourseStatusFilterProps) {
  return (
    <div className="relative">
      <select
        value={selectedStatus}
        onChange={(e) =>
          setSelectedStatus(e.target.value)
        }
        className="
          appearance-none
          min-w-[180px]
          px-4
          py-3
          pr-10
          rounded-xl
          border
          border-gray-300
          dark:border-gray-700
          bg-white
          dark:bg-gray-800
          text-sm
          font-medium
          text-gray-700
          dark:text-gray-200
          shadow-sm
          hover:border-blue-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/20
          focus:border-blue-500
          transition-all
          duration-200
          cursor-pointer
        "
      >
        <option value="All">All Courses</option>
        <option value="Start Learning">
          Start Learning
        </option>
        <option value="In Progress">
          In Progress
        </option>
        <option value="Completed">
          Completed
        </option>
      </select>

      <ChevronDown
        size={18}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-gray-400
          pointer-events-none
        "
      />
    </div>
  );
}

export default CourseStatusFilter;