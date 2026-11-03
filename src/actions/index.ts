// src/actions/index.ts
import { getReviews } from "./reviews/getReviews.action";
import { getProducts } from "./products/getProducts.action";
import { getProductBySlug } from "./products/getProductBySlug.action";
import { getStores } from "./stores/getStores.action";

export const server = {
  // Reviews
  getReviews,

  // Products
  getProducts,
  getProductBySlug,

  // Stores & ZIP Locator
  getStores,
};
