import * as FavoriteQueries from "../queries/favoriteQueries";

export const FavoriteService = {
  async toggleCourseFavorite(userId: number, courseId: number) {
    const favoriteExists = await FavoriteQueries.checkFavoriteRelationship(userId, courseId);

    if (favoriteExists) {
      await FavoriteQueries.deleteFavorite(userId, courseId);
      return { isFavorite: false, message: "Removed item from workspace watchlists." };
    } else {
      await FavoriteQueries.createFavorite(userId, courseId);
      return { isFavorite: true, message: "Added item into favorite collections." };
    }
  },

  async fetchUserFavoriteCourses(userId: number) {
    return await FavoriteQueries.getFavoriteCoursesMetadata(userId);
  }
};