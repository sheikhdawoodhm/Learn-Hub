import React from "react";
import { Heart, Star, Eye, Clock } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoritesSlice";
import "react-tooltip/dist/react-tooltip.css";
import API from "../api/axiosAPI";

interface CourseCardProps {
  course: {
    id: string | number;
    title: string;
    description: string;
    thumbnail_url?: string;
    difficulty?: string;
    rating?: number;
    views?: string | number;
    duration?: string;
    modules?: any[];
    total_modules?: number;
    total_lessons?: number; 
    totalLessons?: number;
  };
}

function CourseCard({ course }: CourseCardProps) {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const completedLectures = useSelector((state: any) =>
    state.progress?.completedLectures || state.userProgress?.completedLectures || []
  );

  const totalLessons = course.total_lessons || course.totalLessons ||
    course.modules?.reduce((acc: number, mod: any) => acc + (mod.videos?.length || 0), 0) || 0;

  const completedForThisCourse = completedLectures.filter((key: string) =>
    key.startsWith(`${course.id}-`)
  ).length;

  const courseProgress = totalLessons > 0
    ? Math.min(Math.round((completedForThisCourse / totalLessons) * 100), 100)
    : 0;

  const favoritesState = useSelector((state: any) => state.favorites);
  const favorites = favoritesState?.favorites || [];

  const isFavorite = favorites.some((fav: any) => String(fav?.id) === String(course?.id));

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); 

    if (isFavorite) {
      dispatch(removeFavorite(course.id));
      
      try {
        await API.post("/favorites", { courseId: course.id });
      } catch (error) {
        console.error("Error removing favorite from backend:", error);
        dispatch(addFavorite({ 
          id: course.id, 
          title: course.title, 
          description: course.description,
          thumbnail: course.thumbnail_url || (course as any).thumbnail,
          difficulty: course.difficulty,
          rating: course.rating,
          views: course.views,
          total_modules: course.total_modules || 0
        }));
      }

    } else {
      const favoritePayload = {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail_url || (course as any).thumbnail,
        difficulty: course.difficulty,
        rating: course.rating,
        views: course.views,
        total_modules: course.total_modules || 0
      };
      
      dispatch(addFavorite(favoritePayload));
      
      try {
        await API.post("/favorites", { courseId: course.id });
      } catch (error) {
        console.error("Error adding favorite to backend:", error);
        dispatch(removeFavorite(course.id));
      }
    } 
  };

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className={`group h-full flex flex-col rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
    >
      <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-950">
        <img
          src={(course as any).thumbnail || course.thumbnail_url || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=500"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {course.difficulty && (
          <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm text-white ${course.difficulty === "Beginner" ? "bg-emerald-500" :
            course.difficulty === "Intermediate" ? "bg-amber-500" : "bg-rose-500"
            }`}>
            {course.difficulty}
          </span>
        )}

        <button
          type="button"
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 cursor-pointer rounded-full flex items-center justify-center backdrop-blur transition-all z-10 ${darkMode ? "bg-black/60 hover:bg-black/80" : "bg-white/80 hover:bg-white"
            }`}
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-red-500 text-red-500 scale-110 transition-transform" : "text-gray-400 hover:text-red-400"}
          />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3">
        <h3 className={`text-base font-bold line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${darkMode ? "text-white" : "text-gray-900"
          }`}>
          {course.title}
        </h3>

        <p className={`text-xs line-clamp-2 leading-relaxed flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {course.description}
        </p>

        <div className="grid grid-cols-3 gap-2 text-[11px] font-medium pt-2 text-gray-400 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" /> {course.rating || "4.8"}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {course.views || "150"}
          </span>
          <span className="flex items-center gap-1 truncate">
            <Clock size={12} /> {course.total_modules || 0} Modules
          </span>
        </div>

        <div className="pt-2">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${courseProgress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
            <span>{courseProgress}% Completed</span>
            <span className="text-gray-400 font-normal">{completedForThisCourse}/{totalLessons} Lessons</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${course.id}`);
          }}
          className="w-full cursor-pointer pt-2.5 pb-2.5 text-xs rounded-xl font-bold bg-indigo-700 hover:bg-indigo-600 text-white transition-colors shadow-sm"
        >
          {courseProgress === 0 ? "Start Learning" : courseProgress === 100 ? "Review Course" : "Continue Learning"}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;