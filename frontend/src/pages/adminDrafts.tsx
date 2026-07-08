import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axiosAPI";
import { useNotification } from "../context/NotificationContext";
import { Edit3, BookOpen, Trash2 } from "lucide-react";
import { useModal } from "../context/ModalContext";

export default function AdminDrafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useSelector((state: any) => state.auth);
  const { confirm } = useModal();

  useEffect(() => {
    // If not admin/instructor, boot them out
    if (user?.role !== "admin" && user?.role !== "instructor") {
      navigate("/");
      return;
    }

    const fetchDrafts = async () => {
      try {
        const response = await API.get("/courses/drafts");
        if (response.data.success) {
          setDrafts(response.data.drafts);
        }
      } catch (err: any) {
        showNotification(err.response?.data?.message || "Failed to load drafts", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [user, navigate, showNotification]);

  const handleDelete = async (courseId: string) => {
    const isConfirmed = await confirm({
      title: "Delete Draft",
      message: "Are you sure you want to delete this draft course? This action cannot be undone."
    });
    
    if (isConfirmed) {
      try {
        await API.delete(`/courses/${courseId}`);
        showNotification("Draft deleted successfully", "success");
        setDrafts((prev) => prev.filter((d) => d.id !== courseId));
      } catch (err: any) {
        showNotification(err.response?.data?.message || "Failed to delete draft", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Edit3 className="w-8 h-8 text-indigo-500" />
            Admin Dashboard - Draft Courses
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Continue building out your courses. Click on a draft to add modules, videos, and quizzes.
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold mb-1">No Drafts Found</h3>
            <p className="text-sm">You don't have any unfinished courses. Want to create a new one?</p>
            <button
              onClick={() => navigate("/add-course")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
            >
              Create New Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((course) => (
              <div 
                key={course.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={course.thumbnail_url || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=500"} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    Draft
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="flex-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Continue Editing
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
