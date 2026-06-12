import { useTheme } from "../context/ThemeContext"

type CourseCardProps = {
  image: string
  category: string
  difficulty: string
  title: string
  description: string
}

const CourseCard = ({
  image,
  category,
  difficulty,
  title,
  description,
}: CourseCardProps) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
    >
      <img
        className="w-full h-60 object-cover"
        src={image}
        alt={title}
      />

      <div className="p-6">
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>

          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {difficulty}
          </span>
        </div>

        <h3 className="text-2xl font-bold mt-4">
          {title}
        </h3>

        <p
          className={`mt-4 ${
            darkMode
              ? "text-gray-300"
              : "text-gray-600"
          }`}
        >
          {description}
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
          Start Learning
        </button>
      </div>
    </div>
  )
}

export default CourseCard