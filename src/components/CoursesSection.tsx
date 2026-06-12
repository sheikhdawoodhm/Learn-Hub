import CourseCard from "./CourseCard"
import { courses } from "../data/courses"

const CoursesSection = () => {
  return (
    <section className="py-32 px-6 md:px-10 max-w-[1440px] mx-auto">

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">

        <div className="space-y-4 text-left">

          <h2 className="text-4xl font-bold">
            Curated Learning Paths
          </h2>

          <p className="text-gray-600 max-w-xl">
            Upskill your teams with expert-led content
            designed for today's competitive landscape.
          </p>

        </div>

        <button className="text-blue-600 font-bold">
          View All Courses →
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {courses.map((course) => (
          <CourseCard
            key={course.id}
            image={course.image}
            category={course.category}
            difficulty={course.difficulty}
            title={course.title}
            description={course.description}
          />
        ))}

      </div>
    </section>
  )
}

export default CoursesSection