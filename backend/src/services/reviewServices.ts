import * as reviewQueries from "../queries/reviewQueries";

export const getCourseReviews = async (courseId: number) => {
  return await reviewQueries.selectReviewsByCourseId(courseId);
};

export const addReviewComponents = async (userId: number, courseId: number, commentText?: string, rating?: number) => {
  let commentData = null;
  let ratingData = null;

  if (commentText) {
    commentData = await reviewQueries.insertComment(userId, courseId, commentText);
  }

  if (rating) {
    
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }
    ratingData = await reviewQueries.upsertRating(userId, courseId, rating);
  }

  return { 
    comment: commentData, 
    rating: ratingData 
  };
};