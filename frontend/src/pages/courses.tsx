import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // 1. Added router navigation hook
import { Plus } from "lucide-react"; // Optional clean plus icon

import SearchBar from "../components/searchBar";
import CourseFilters from "../components/courseFilters";
import CourseCard from "../components/courseCard";
import CourseStatusFilter from "../components/courseStatusFilter";

import { useDebounce } from "../hooks/useDebounce";

function Courses() {
  const navigate = useNavigate(); // 2. Initialize navigate function
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const courses = useSelector((state: any) => state.courses.courses || []);
  const debounceValue = useDebounce(searchTerm, 400);
  const progress = useSelector((state: any) => state.progress?.progress || {});

  const filteredCourses = useMemo(() => {
    const search = debounceValue.trim().toLowerCase();
    let filtered = [...courses];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((course: any) => {
        return course.difficulty === selectedCategory || course.category === selectedCategory;
      });
    }

    if (search) {
      filtered = filtered.filter((course: any) => {
        const title = (course.title || "").toLowerCase();
        const description = (course.description || "").toLowerCase();
        return title.includes(search) || description.includes(search);
      });
    }

    if (selectedStatus === "Completed") {
      filtered = filtered.filter((course: any) => (progress?.[course.id]?.progress ?? 0) === 100);
    } else if (selectedStatus === "In Progress") {
      filtered = filtered.filter((course: any) => {
        const p = progress?.[course.id]?.progress ?? 0;
        return p > 0 && p < 100;
      });
    } else if (selectedStatus === "Start Learning") {
      filtered = filtered.filter((course: any) => (progress?.[course.id]?.progress ?? 0) === 0);
    }

    return filtered;
  }, [courses, debounceValue, selectedCategory, selectedStatus, progress]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-3">Explore Courses</h1>
          <p className="text-gray-500 mb-8">
            Discover and master new skills.
          </p>
        </div>

        {/* 3. Button row containing your custom Route trigger and Status Filter dropdown */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => navigate("/add-course")}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>

          <CourseStatusFilter
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
      </div>

      <div className="space-y-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <CourseFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No courses found.
          </p>
        ) : (
          filteredCourses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;