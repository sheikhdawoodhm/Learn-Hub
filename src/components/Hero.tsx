const Hero = () => {
  return (
    <section className="relative pt-24 pb-32 px-6 md:px-10 max-w-[1440px] mx-auto text-center">
      <div className="max-w-4xl mx-auto space-y-6">

        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 dark:text-gray-400 text-sm border border-blue-200">
          The Future of Corporate Learning
        </span>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Empower Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Team's Growth
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          The enterprise LMS built for modern organizations.
          Elevate performance, streamline onboarding,
          and foster a culture of continuous learning.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-xl hover:scale-105 transition-all">
            Get Started
          </button>
        </div>

      </div>

      <div className="mt-20 relative max-w-6xl mx-auto">
        <div className="relative z-10 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl transition-colors duration-300">
          <img
            className="rounded-2xl w-full"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL691tE_I9jf3cLwO_o3UcNuvqa3HKtgloa-tMY5XmyGO60DCx_mLL4c3XemktQI_Ec79SCcNmF09eLfnfdojYbspNaurrwNWEqwfLyYOIYxoqnI9ZwrhDW7K0c3bzVjw2iBCglwzK0x7nx6Z2ri9k9_KkdH0-e3nxh64Fyun-6lArxLRAFemwBrEKiBItvmCDJMsYeKSS8uhAQwmdGHDAZiw9FfV2NCchdHnYdV9X93UIsw2EX6FLLibPfm2UVCUucl22p8Ur8Vg"
            alt="Dashboard"
          />
        </div>
      </div>

    </section>
  )
}

export default Hero