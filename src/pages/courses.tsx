import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import SearchBar from "../components/searchBar";
import CourseFilters from "../components/courseFilters";
import CourseCard from "../components/courseCard";
import CourseStatusFilter from "../components/courseStatusFilter";

import { fetchCourses } from "../services/fetchCourses";
import { useDebounce } from "../hooks/useDebounce";

function Courses() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);

  const debounceValue = useDebounce(searchTerm, 400);

  const progress = useSelector((state: any) => state.progress.progress);

  useEffect(() => {
    const loadData = async () => {
      const baseQuery =
        "programming tutorial web development javascript react python";

      const search = debounceValue.trim();
      const category = selectedCategory !== "All" ? selectedCategory : "";

      let query = baseQuery;

      if (search && category) {
        query = `${search} ${category}`;
      } else if (search) {
        query = search;
      } else if (category) {
        query = category;
      }

      const data = await fetchCourses(query, progress);
      setCourses(data || []);
    };

    loadData();
  }, [debounceValue, selectedCategory]);

  const filteredCourses = useMemo(() => {
    const search = debounceValue.trim().toLowerCase();

    let filtered = [...courses];

    if (search) {
      filtered = filtered.filter((course: any) => {
        const title = (course.title || "").toLowerCase();
        const description = (course.description || "").toLowerCase();

        return title.includes(search) || description.includes(search);
      });
    }

    filtered = filtered.filter((course: any) => {
      const p = progress?.[course.id]?.progress ?? 0;

      if (selectedStatus === "Completed") return p === 100;
      if (selectedStatus === "In Progress") return p > 0 && p < 100;
      if (selectedStatus === "Start Learning") return p === 0;

      return true;
    });

    return filtered;
  }, [courses, debounceValue, selectedStatus, progress]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-3">Explore Courses</h1>
          <p className="text-gray-500 mb-8">
            Discover and master new skills.
          </p>
        </div>

        <CourseStatusFilter
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
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