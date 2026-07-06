import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CourseCard from "./courseCard";
import CourseCardSkeleton from "./courseCardSkeleton";

import API from "../api/axiosAPI";

function CoursesSection() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {




        const response = await API.get("/courses");
        const data = response.data.courses; // Assuming the backend returns { courses: [...] }
        setCourses(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  return (
    <section className="py-24 px-6 md:px-10 max-w-[1440px] mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold">
          Featured Courses
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore popular courses and start learning new skills at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))
        )}
      </div>

      {!loading && courses.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Explore All Courses →
          </Link>
        </div>
      )}
    </section>
  );
}

export default CoursesSection;