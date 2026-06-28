import { Heart, Star, Eye, Clock, User } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoritesSlice";
import "react-tooltip/dist/react-tooltip.css";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    difficulty?: string;
    instructor?: string;
    instructorImage?: string;
    rating?: number;
    views?: string | number;
    duration?: string;
    modules?: any[];
  };
}

function CourseCard({ course }: CourseCardProps) {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Progress State Check (Using your userProgress slice structure)
  // Fallback check matching either your original setup or module-count checks
  const progress = useSelector((state: any) => state.progress?.progress);
  const courseProgress = progress?.[course.id]?.progress ?? 0;

  // 2. Favorites System
  const favorites = useSelector((state: any) => state.favorites?.favorites || []);
  const isFavorite = favorites.some((fav: any) => fav.id === course.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the heart from triggering the card navigate link
    if (isFavorite) {
      dispatch(removeFavorite(course.id));
    } else {
      dispatch(addFavorite(course));
    }
  };

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)} // Clicking anywhere on the card opens your module page
      className={`group h-full flex flex-col rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      {/* Thumbnail Banner */}
      <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-950">
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=500"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=500";
          }}
        />

        {/* Difficulty Badge */}
        {course.difficulty && (
          <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm text-white ${
            course.difficulty === "Beginner" ? "bg-emerald-500" :
            course.difficulty === "Intermediate" ? "bg-amber-500" : "bg-rose-500"
          }`}>
            {course.difficulty}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavorite}
          data-tooltip-id="favorite-tip"
          data-tooltip-content={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 w-9 h-9 cursor-pointer rounded-full flex items-center justify-center backdrop-blur transition-all ${
            darkMode ? "bg-black/60 hover:bg-black/80" : "bg-white/80 hover:bg-white"
          }`}
        >
          <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Main Content Info Wrapper */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        
        {/* Title */}
        <h3 className={`text-base font-bold line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          {course.title}
        </h3>

        {/* Instructor Block (Displays safe placeholders if missing in your form slice) */}
        <div className="flex items-center gap-2 text-xs">
          {course.instructorImage ? (
            <img src={course.instructorImage} className="w-5 h-5 rounded-full" />
          ) : (
            <User className="w-4 h-4 text-gray-400" />
          )}
          <span className={`truncate font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {course.instructor || "Self-Paced Course"}
          </span>
        </div>

        {/* Description Text */}
        <p className={`text-xs line-clamp-2 leading-relaxed flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {course.description}
        </p>

        {/* Metadata Row Grid */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-medium pt-2 text-gray-400 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500"/> {course.rating || "4.8"}</span>
          <span className="flex items-center gap-1"><Eye size={12}/> {course.views || "150"}</span>
          <span className="flex items-center gap-1 truncate"><Clock size={12}/> {course.duration || `${course.modules?.length || 0} Modules`}</span>
        </div>

        {/* Dynamic Progress Engine Layout */}
        <div className="pt-2">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden" data-tooltip-id="progress-tip" data-tooltip-content={`${courseProgress}% completed`}>
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${courseProgress}%` }} />
          </div>
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
            {courseProgress}% Completed
          </p>
        </div>

        {/* CTA Launch Action Button */}
        <button
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