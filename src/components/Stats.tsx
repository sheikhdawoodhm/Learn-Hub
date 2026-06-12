import { useTheme } from "../context/ThemeContext"

const Stats = () => {
  const { darkMode } = useTheme()

  return (
    <section
      className={`py-20 my-20 ${
        darkMode ? "bg-gray-400" : "bg-white"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className={`p-10 rounded-2xl text-center shadow-md ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-black"
          }`}
        >
          <h3 className="text-4xl font-bold">1.2M+</h3>

          <p className="text-gray-500 mt-2">
            Courses Completed
          </p>
        </div>

        <div
          className={`p-10 rounded-2xl text-center shadow-md ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-black"
          }`}
        >
          <h3 className="text-4xl font-bold">500k+</h3>

          <p className="text-gray-500 mt-2">
            Active Learners
          </p>
        </div>

        <div
          className={`p-10 rounded-2xl text-center shadow-md ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-black"
          }`}
        >
          <h3 className="text-4xl font-bold">99.4%</h3>

          <p className="text-gray-500 mt-2">
            Satisfaction Rate
          </p>
        </div>

      </div>
    </section>
  )
}

export default Stats