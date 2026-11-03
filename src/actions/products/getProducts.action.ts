import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { fetchProducts } from "../../services/products.service";

export interface ProductDetailItem {
  title: string;
  content: string;
  icon?: string;
}

export interface LocalizedProductItem {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  bullets: string[];
  details: ProductDetailItem[];
  images: string[];
  image?: string;
  amazonUrl: string;
}

export interface GetProductsResult {
  message: string;
  data: LocalizedProductItem[];
}

export const getProducts = defineAction({
  input: z
    .object({
      lang: z.string().optional(),
    })
    .optional(),
  handler: async (input): Promise<GetProductsResult> => {
    const lang = (input?.lang === "en" ? "en" : "es") as "es" | "en";
    const products = await fetchProducts(lang);

    return {
      message: "Productos obtenidos con éxito",
      data: products,
    };
  },
});
