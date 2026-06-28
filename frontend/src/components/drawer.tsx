import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Sparkles, PlusCircle } from "lucide-react";
import { addCourse } from "../../redux/slices/coursesSlice"; // Adjust path to your slice

interface CreateCourseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCourseDrawer: React.FC<CreateCourseDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // Local Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [thumbnail, setThumbnail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const newCourse = {
      id: crypto.randomUUID(),
      title,
      difficulty,
      description,
      thumbnail: thumbnail.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500", // Fallback thumbnail placeholder
      modules: [],
    };

    dispatch(addCourse(newCourse));
    
    // Reset state fields and close drawer panel
    setTitle("");
    setDescription("");
    setDifficulty("Beginner");
    setThumbnail("");
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay Blur Cover Screen */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sliding Drawer Body Shell Container */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header Navbar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Create New Course</h2>
              <p className="text-xs text-slate-400 mt-0.5">Set up your base shell parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Window Body Layout */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Course Title *
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master TypeScript Pro"
              className="w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Course Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the student will learn in this learning module collection path..."
              className="w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 resize-none"
            />
          </div>
        </form>

        {/* Sticky Action Footer controls */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
              !title.trim() || !description.trim()
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg shadow-indigo-100 dark:shadow-none cursor-pointer"
            }`}
          >
            Create Base Shell <Sparkles className="w-4 h-4 text-yellow-400" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateCourseDrawer;