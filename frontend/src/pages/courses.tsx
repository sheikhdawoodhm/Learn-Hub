import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../api/axiosAPI"; 
import { setCourses } from "../redux/slices/coursesSlice"; 
import { hydrateFavorites } from "../redux/slices/favoritesSlice"; 

import SearchBar from "../components/searchBar";
import CourseFilters from "../components/courseFilters";
import CourseCard from "../components/courseCard";
import CourseStatusFilter from "../components/courseStatusFilter"; 

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

function Courses() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All"); 
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  const courses = useSelector((state: any) => state.courses.courses);
  const { user } = useSelector((state: any) => state.auth); 
  
  const completedLectures = useSelector((state: any) => 
    state.progress?.completedLectures || state.userProgress?.completedLectures || []
  );


  useEffect(() => {
    if (user?.id) {
      dispatch(hydrateFavorites(user.id));
    }
  }, [dispatch, user?.id]);


  useEffect(() => {
    const fetchAllCoursesFromDB = async () => {
      try {
        let url = `/courses?page=${page}&limit=6`;
        let finalSearchQuery = searchTerm.trim();

        if (selectedCategory !== "All") {
          finalSearchQuery = finalSearchQuery 
            ? `${finalSearchQuery} ${selectedCategory}` 
            : selectedCategory;
        }

        if (finalSearchQuery) {
          url += `&search=${encodeURIComponent(finalSearchQuery)}`;
        }
        
        const response = await API.get(url); 
        
        if (response.data && response.data.courses) {
          dispatch(setCourses(response.data.courses));
          setPaginationMeta(response.data.pagination);
        } else {
          dispatch(setCourses(response.data));
          setPaginationMeta(null); 
        }
      } catch (error) {
        console.error("Could not fetch courses from backend database:", error);
      }
    };

    fetchAllCoursesFromDB();
  }, [dispatch, page, searchTerm, selectedCategory]); 

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1); 
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1); 
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };


  const displayCourses = (Array.isArray(courses) ? courses : []).filter((course: any) => {
    if (selectedStatus === "All") return true;

    const totalLessons = course.total_lessons || course.totalLessons || 
      course.modules?.reduce((acc: number, mod: any) => acc + (mod.videos?.length || 0), 0) || 0;

    const completedCount = completedLectures.filter((key: string) => 
      key.startsWith(`${course.id}-`)
    ).length;

    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    if (selectedStatus.toLowerCase() === "completed") {
      return progressPercent === 100 && totalLessons > 0;
    }
    if (selectedStatus.toLowerCase() === "in progress") {
      return progressPercent > 0 && progressPercent < 100;
    }
    if (selectedStatus.toLowerCase() === "unstarted") {
      return completedCount === 0;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-3">Explore Courses</h1>
          <p className="text-gray-500 mb-8">Discover and master new skills.</p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => navigate("/add-course")}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-100"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>

          <CourseStatusFilter
            selectedStatus={selectedStatus}
            setSelectedStatus={handleStatusChange}
          />
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
        <CourseFilters selectedCategory={selectedCategory} setSelectedCategory={handleCategoryChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayCourses.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full py-12">No courses found matching your criteria.</p>
        ) : (
          displayCourses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>

      {displayCourses.length > 0 && paginationMeta && paginationMeta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 border rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-slate-600">
            Page {paginationMeta.currentPage} of {paginationMeta.totalPages}
          </span>
          
          <button
            disabled={page === paginationMeta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;