import { memo, useState, useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";// Check your slice path
import CourseCard from "../components/courseCard";
import { setFavorites } from "../redux/slices/favoritesSlice"; // Adjust the import path as necessary
import API from "../api/axiosAPI";

function Favorites() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const favorites = useAppSelector(
    (state) => state.favorites.favorites
  ) || [];


 useEffect(() => {
  const loadFreshFavorites = async () => {
    try { 
      const response = await API.get("/favorites");
      
      if (response.data && response.data.favorites) {
        dispatch(setFavorites(response.data.favorites));
      }
    } catch (err) {
      console.error("Failed to sync fresh favorites:", err);
    }
  };

  loadFreshFavorites();
}, [dispatch]);

  const filteredFavorites = favorites.filter(
    (course: any) =>
      course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Favorites</h1>
        <p className="text-gray-500 mt-2">
          {favorites.length} Saved Course{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search favorite courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 mb-8"
      />

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
          <p className="text-gray-500">Click the ❤️ icon on any course to save it here.</p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
          <p className="text-gray-500">No favorite courses match "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredFavorites.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Favorites);