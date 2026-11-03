import { defineAction } from "astro:actions";
import content from "../../data/reviews/reviews.json";

export interface ReviewItem {
  id: number;
  name: string;
  verified?: boolean;
  title?: string;
  comment: string;
  rating: number;
  date: string;
}

export interface GetReviewsResult {
  message: string;
  data: ReviewItem[];
}

export const getReviews = defineAction({
  handler: async (): Promise<GetReviewsResult> => {
    const data = (content.reviews || []) as ReviewItem[];
    return {
      message: "Reseñas obtenidas con éxito",
      data,
    };
  },
});
