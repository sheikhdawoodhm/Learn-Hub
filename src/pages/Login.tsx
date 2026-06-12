import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="w-full max-w-6xl md:h-[85vh] max-h-[800px] flex rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">

        <section className="hidden md:flex w-1/2 flex-col justify-between p-6 lg:p-12 bg-white dark:bg-gray-800 relative">

          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 flex items-center justify-center rounded-xl">
                <span className="material-symbols-outlined text-white">
                  school
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-blue-600">
                LearnHub
              </h1>
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
              Learn smarter with{" "}
              <span className="text-blue-600">LearnHub</span>
            </h2>

            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-md">
              Discover courses, track your learning progress, save favorites,
              and build skills that help you grow professionally.
            </p>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-blue-600">
                menu_book
              </span>
              <span>Explore quality courses</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-blue-600">
                analytics
              </span>
              <span>Track your learning progress</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-blue-600">
                favorite
              </span>
              <span>Save your favorite content</span>
            </div>
          </div>

          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </section>

        <section className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
          <div className="w-full max-w-md">

            <div className="md:hidden text-center mb-8">
              <div className="w-12 h-12 bg-blue-600 mx-auto flex items-center justify-center rounded-xl mb-3">
                <span className="material-symbols-outlined text-white">
                  school
                </span>
              </div>

              <h1 className="text-2xl font-bold text-blue-600">
                LearnHub
              </h1>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sign in to continue your learning journey.
            </p>

            <form className="space-y-4 md:space-y-5">

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                    mail
                  </span>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full h-12 pl-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                    lock
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-semibold transition"
              >
                loginWithRedirect()         
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-3 text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            <button className="w-full h-12 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.3 0 10.3-2 14-5.4l-6.5-5.3C29.4 35.7 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.4 39.7 16.1 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.7-6.3 7.3l6.5 5.3C38.7 37.2 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>

              <span className="font-medium">Continue with Google</span>
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}