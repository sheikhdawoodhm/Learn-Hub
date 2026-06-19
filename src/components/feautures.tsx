const features = [
  {
    title: "Discover Courses",
    description:
      "Search and explore educational content across a wide range of topics.",
  },
  {
    title: "Track Progress",
    description:
      "Continue learning from where you left off and stay consistent.",
  },
  {
    title: "Save Favorites",
    description:
      "Bookmark courses and create your own personalized learning library.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold">
            Everything You Need to Keep Learning
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            A simple platform designed to help you discover,
            save, and complete courses without distractions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                p-8
                rounded-2xl
                bg-white
                dark:bg-gray-800
                border
                border-gray-300
                dark:border-gray-700
                shadow-md
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;