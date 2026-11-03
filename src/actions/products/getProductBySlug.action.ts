import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { fetchProductBySlug } from "../../services/products.service";
import type { LocalizedProductItem } from "./getProducts.action";

export interface GetProductBySlugResult {
  message: string;
  data: LocalizedProductItem;
}

export const getProductBySlug = defineAction({
  input: z.object({
    slug: z.string().min(1, "El slug es obligatorio"),
    lang: z.string().optional(),
  }),
  handler: async ({ slug, lang: inputLang }): Promise<GetProductBySlugResult> => {
    const lang = (inputLang === "en" ? "en" : "es") as "es" | "en";
    const product = await fetchProductBySlug(slug, lang);

    if (!product) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Producto con slug '${slug}' no encontrado en idioma '${lang}'`,
      });
    }

    return {
      message: "Producto encontrado con éxito",
      data: product,
    };
  },
});
