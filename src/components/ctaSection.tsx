import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24">
      <div
        className="
          max-w-5xl
          mx-auto
          px-8
          py-16
          rounded-3xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-center
          text-white
        "
      >
        <h2 className="text-4xl font-bold">
          Ready to Start Learning?
        </h2>

        <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
          Discover new skills, save your favorite courses,
          and track your learning journey all in one place.
        </p>

        <Link
          to="/courses"
          className="
            inline-block
            mt-8
            px-8
            py-4
            bg-white
            text-blue-600
            font-semibold
            rounded-xl
            hover:scale-105
            transition
          "
        >
          Browse Courses
        </Link>
      </div>
    </section>
  );
};

export default CTASection;