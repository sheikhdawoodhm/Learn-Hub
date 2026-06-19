import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-40 px-6 md:px-10 max-w-[1440px] mx-auto text-center">
      <div className="max-w-4xl mx-auto">

        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium border border-blue-200">
          Your Personal Learning Hub
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Learn New Skills,
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            One Course at a Time
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover quality learning content, track your progress,
          and build a personalized collection of courses to achieve
          your goals.
        </p>

        <div className="pt-8">
          <Link to = "/courses" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer">
            Explore Courses
          </Link>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Free • Personalized • Progress Tracking
          </p>
        </div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
          <img
            className="w-full"
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
            alt="Learning Dashboard"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;