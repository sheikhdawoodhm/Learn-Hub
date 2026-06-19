import { Heart } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../redux/slices/favoritesSlice";

import "react-tooltip/dist/react-tooltip.css";

function CourseCard({ course }: any) {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const progress = useSelector(
    (state: any) => state.progress.progress
  );

  const courseProgress =
    progress?.[course.id]?.progress ?? 0;

  const favorites = useSelector(
    (state: any) => state.favorites.favorites
  );

  const isFavorite = favorites.some(
    (fav: any) => fav.id === course.id
  );

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(course.id));
    } else {
      dispatch(addFavorite(course));
    }
  };

  return (
    <div
      className={`group h-full flex flex-col rounded-2xl overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={
            course.thumbnail ||
            `https://i.ytimg.com/vi/${course.id}/hqdefault.jpg`
          }
          alt={course.title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/320x180?text=No+Image";
          }}
        />

        <button
          onClick={handleFavorite}
          data-tooltip-id="favorite-tip"
          data-tooltip-content={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          className={`absolute top-3 right-3 w-10 cursor-pointer h-10 rounded-full flex items-center justify-center backdrop-blur transition ${
            darkMode ? "bg-black/60" : "bg-white/80"
          }`}
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className={`text-lg font-bold line-clamp-2 min-h-[56px] ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {course.title}
        </h3>

        <div className="flex items-center gap-2 text-sm mt-3">
          <img
            src={course.instructorImage}
            className="w-7 h-7 rounded-full"
          />
          <span
            className={`truncate ${
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            {course.instructor}
          </span>
        </div>

        <p
          className={`text-sm line-clamp-2 mt-3 ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {course.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs mt-4">
          <span>⭐ {course.rating}</span>
          <span>👁 {course.views}</span>
          <span>⏱ {course.duration}</span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
          </div>

          <div
            className="h-2 bg-gray-200 rounded-full"
            data-tooltip-id="progress-tip"
            data-tooltip-content={`${courseProgress}% completed`}
          >
            <div
              className="h-full bg-blue-600"
              style={{
                width: `${courseProgress}%`,
              }}
            />
          </div>

          <p className="text-xs text-blue-600 mt-1">
            {courseProgress}% completed
          </p>
        </div>

        <div className="flex-1" />

        <button
          onClick={() =>
            navigate(`/courses/${course.id}`, {
              state: course,
            })
          }
          data-tooltip-id="cta-tip"
          data-tooltip-content={
            courseProgress === 0
              ? "Start this course"
              : courseProgress === 100
              ? "Review completed course"
              : "Continue learning"
          }
          className="w-full cursor-pointer mt-5 py-3 rounded-xl font-semibold bg-indigo-700 hover:bg-indigo-800 text-white"
        >
          {courseProgress === 0
            ? "Start Learning"
            : courseProgress === 100
            ? "Review Course"
            : "Continue Learning"}
        </button>
      </div>

      {/* <Tooltip id="cta-tip" /> */}
    </div>
  );
}

export default CourseCard;