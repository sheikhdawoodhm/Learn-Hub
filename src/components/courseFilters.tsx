type CourseFiltersProps = {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<string>
  >;
};

const categories = [
  "All",
  "React",
  "JavaScript",
  "TypeScript",
  "Node",
  "Python",
  "AI",
  "UI/UX"
];

function CourseFilters({
  selectedCategory,
  setSelectedCategory,
}: CourseFiltersProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-5 py-2  cursor-pointer rounded-full whitespace-nowrap transition-all
          ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
      ))}

    </div>
  );
}

export default CourseFilters;