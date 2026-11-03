import productsFallbackData from "../data/products/products.data.json";
import type { LocalizedProductItem, ProductDetailItem } from "../actions/products/getProducts.action";

/**
 * Obtiene la URL base del backend desde las variables de entorno de Astro
 */
const getBaseUrl = (): string => {
  const url = import.meta.env.BACKEND_API_URL || "https://webadminsystem.cadimportinc.com/api/v1/";
  return url.endsWith("/") ? url : `${url}/`;
};

/**
 * Obtiene la API Key del backend desde las variables de entorno de Astro
 */
const getApiKey = (): string => {
  return import.meta.env.BACKEND_API_KEY || "443a427b-6ed0-4efb-8f76-9c475254fe1c";
};

/**
 * Mapea la estructura del item devuelto por la API al contrato LocalizedProductItem
 */
function mapApiItemToProduct(rawItem: any): LocalizedProductItem {
  const data = rawItem?.data || rawItem || {};

  const images: string[] = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : [data.image || "/images/products/multi-vitamin-liquido.svg"];

  const details: ProductDetailItem[] = Array.isArray(data.details)
    ? data.details.map((d: any) => ({
        title: d.title || "",
        content: d.content || "",
        icon: d.icon || "usage",
      }))
    : [];

  return {
    id: String(data.id || rawItem.id || ""),
    slug: String(data.slug || ""),
    sku: String(data.sku || ""),
    name: String(data.name || ""),
    description: String(data.description || ""),
    bullets: Array.isArray(data.bullets) ? data.bullets : [],
    details,
    images,
    image: images[0],
    amazonUrl: data.amazonurl || data.amazonUrl || "https://www.amazon.com",
  };
}

/**
 * Obtiene la lista de productos para el idioma indicado desde el backend centralizado
 * Endpoint: GET /api/v1/content/products-{lang}
 */
export async function fetchProducts(lang: "es" | "en" = "es"): Promise<LocalizedProductItem[]> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  const endpoint = `${baseUrl}content/products-${lang}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`[ProductsService] Backend API returned status ${response.status} for products-${lang}`);
      return getFallbackProducts(lang);
    }

    const json = await response.json();
    const items = json?.items;

    if (!Array.isArray(items) || items.length === 0) {
      console.warn(`[ProductsService] No items returned from API for products-${lang}, using fallback`);
      return getFallbackProducts(lang);
    }

    return items.map(mapApiItemToProduct);
  } catch (error) {
    console.error(`[ProductsService] Error fetching products-${lang}:`, error);
    return getFallbackProducts(lang);
  }
}

/**
 * Obtiene un producto por su slug en el idioma indicado desde el backend centralizado
 * Endpoint: GET /api/v1/content/products-{lang}?slug={slug}
 */
export async function fetchProductBySlug(slug: string, lang: "es" | "en" = "es"): Promise<LocalizedProductItem | null> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  const endpoint = `${baseUrl}content/products-${lang}?slug=${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      const items = json?.items;
      if (Array.isArray(items) && items.length > 0) {
        const matched = items.find((it: any) => (it.data?.slug || it.slug) === slug) || items[0];
        return mapApiItemToProduct(matched);
      }
    }

    // Si la búsqueda filtrada directa no devuelve resultados, buscar en la lista completa
    const allProducts = await fetchProducts(lang);
    const found = allProducts.find((p) => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase());
    if (found) return found;

    // Fallback local
    const fallbackList = getFallbackProducts(lang);
    return fallbackList.find((p) => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase()) || null;
  } catch (error) {
    console.error(`[ProductsService] Error fetching product slug ${slug} in ${lang}:`, error);
    const fallbackList = getFallbackProducts(lang);
    return fallbackList.find((p) => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase()) || null;
  }
}

/**
 * Fallback a los datos locales en caso de caída o indisponibilidad temporal del backend
 */
function getFallbackProducts(lang: "es" | "en"): LocalizedProductItem[] {
  const productsByLang = productsFallbackData.products as Record<"es" | "en", LocalizedProductItem[]>;
  return productsByLang[lang] || productsByLang.es || [];
}
