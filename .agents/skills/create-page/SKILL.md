---
name: create-page
description: Creates or updates multilingual Astro pages in src/pages/[lang]/..., handling Astro.params, lang validation with 404 redirects, Astro.callAction execution, SEO metadata, and Layout composition.
---

# Create Page Skill

Esta skill define las reglas, patrones y estándares para crear y estructurar páginas dinámicas multilenguaje en **AutoUI** (`src/pages/`).

---

## 1. Responsabilidad y Ubicación

Las páginas en AutoUI orquestan el flujo de datos y renderizado para cada ruta del sitio:
- Extraen parámetros de ruta (`Astro.params`).
- Validan el idioma activo contra la configuración de `src/i18n/config.i18n.ts`.
- Llaman a Server Actions mediante `Astro.callAction`.
- Validan reglas de negocio y pertenencia de recursos.
- Envuelven la vista en el `<Layout>` central con sus metadatos SEO.
- Componen las secciones y componentes visuales pasando props serializadas.

### Convenciones de Rutas
```plaintext
src/pages/
├── index.astro                   # Redirección raíz al idioma por defecto (/es)
├── 404.astro                     # Manejo visual de rutas inexistentes
└── [lang]/                       # Enrutamiento dinámico multilenguaje
    ├── index.astro               # Home del sitio (ej. /es o /en)
    └── [category]/               # Vistas anidadas
        ├── index.astro           # Listado de productos o vista de categoría
        └── [product]/
            └── index.astro       # Ficha técnica y detalle de producto
```

---

## 2. Reglas Inquebrantables de Pages

1. **Ubicación Obligatoria bajo `[lang]`**:
   - Toda página pública con contenido debe residir dentro de `src/pages/[lang]/...`.
   - Se debe mantener la concordancia con la configuración de `astro.config.mjs` (`prefixDefaultLocale: true`).
2. **Validación Inmediata de Idioma**:
   - En el bloque de servidor (frontmatter `---`), se debe validar que `lang` pertenezca a los idiomas válidos (`LANGUAGES` o claves del diccionario de contenido).
   - Si no es válido, retornar inmediatamente `return Astro.redirect('/404');`.
3. **Consumo de Datos mediante Server Actions**:
   - Toda consulta dinámica de datos se realiza llamando a las acciones registradas usando `Astro.callAction(actions.<accion>, { ... })`.
   - Si un recurso consultado no existe o no pertenece a su categoría padre, retornar `return Astro.redirect('/404');`.
4. **Composición con Layout**:
   - Toda página debe utilizar `<Layout title={...} lang={...}>`.
   - Props obligatorias de `Layout.astro`: `title` y `lang`.
   - Props opcionales para SEO: `description`, `image`, `schema` (JSON-LD para Google) y `canonicalPath`.
5. **División Limpia en Secciones**:
   - El archivo de página no debe tener cientos de líneas de HTML o estilos embebidos; debe estructurarse componiendo las secciones creadas en `src/components/<pagina>/sections/`.

---

## 3. Plantillas de Páginas

### A. Página Home (`src/pages/[lang]/index.astro`)

```astro
---
// src/pages/[lang]/index.astro
import Layout from '../../layouts/Layout.astro';
import homeContent from '../../data/site-example-content.json';
import { LANGUAGES, type Lang } from '../../i18n/config.i18n';
import Hero from '../../components/home/sections/Hero.astro';
import Reviews from '../../components/common/Reviews.astro';
import { actions } from 'astro:actions';

const lang = Astro.params.lang as Lang;

// 1. Validar idioma
if (!(lang in LANGUAGES) || !(lang in homeContent)) {
  return Astro.redirect('/404');
}

const content = homeContent[lang];

// 2. Ejecutar Server Actions si se requieren datos dinámicos
const { data: reviewsResponse } = await Astro.callAction(actions.getReviews, {});
const reviews = reviewsResponse?.data ?? [];
---

<Layout
  title={content.brandName ?? "AutoUI"}
  lang={lang}
  description={content.meta?.description}
>
  <main>
    <Hero lang={lang} />
    {reviews.length > 0 && (
      <Reviews title={content.reviewsTitle ?? "Opiniones"} reviews={reviews} />
    )}
  </main>
</Layout>
```

### B. Página de Categoría (`src/pages/[lang]/[category]/index.astro`)

```astro
---
// src/pages/[lang]/[category]/index.astro
import Layout from '../../../layouts/Layout.astro';
import { LANGUAGES, type Lang } from '../../../i18n/config.i18n';
import { actions } from 'astro:actions';
import CategoryHero from '../../../components/category/sections/CategoryHero.astro';
import ProductGrid from '../../../components/category/sections/ProductGrid.astro';

const lang = Astro.params.lang as Lang;
const { category: categorySlug } = Astro.params;

// 1. Validar idioma
if (!(lang in LANGUAGES) || !categorySlug) {
  return Astro.redirect('/404');
}

// 2. Consultar categoría y productos mediante Server Actions
const { data: catResponse, error: catError } = await Astro.callAction(
  actions.getCategoryBySlug,
  { slug: categorySlug }
);

if (catError || !catResponse?.data) {
  return Astro.redirect('/404');
}

const category = catResponse.data;
const categoryTitle = category.name[lang] || category.name.es;

const { data: productsResponse } = await Astro.callAction(
  actions.getProductsByCategory,
  { categorySlug }
);

const products = productsResponse?.data ?? [];
---

<Layout
  title={`${categoryTitle} | AutoUI`}
  lang={lang}
  description={category.description?.[lang]}
  image={category.image}
>
  <main class="py-10">
    <CategoryHero category={category} lang={lang} />
    <ProductGrid products={products} categorySlug={categorySlug} lang={lang} />
  </main>
</Layout>
```

### C. Página de Detalle de Producto (`src/pages/[lang]/[category]/[product]/index.astro`)

```astro
---
// src/pages/[lang]/[category]/[product]/index.astro
import Layout from '../../../../layouts/Layout.astro';
import { LANGUAGES, type Lang } from '../../../../i18n/config.i18n';
import { actions } from 'astro:actions';
import ProductDetail from '../../../../components/product/sections/ProductDetail.astro';

const lang = Astro.params.lang as Lang;
const { category: categorySlug, product: productSlug } = Astro.params;

// 1. Validar idioma y params
if (!(lang in LANGUAGES) || !categorySlug || !productSlug) {
  return Astro.redirect('/404');
}

// 2. Consultar producto mediante Server Action
const { data: productResponse, error } = await Astro.callAction(
  actions.getProductBySlug,
  { slug: productSlug }
);

if (error || !productResponse?.data) {
  return Astro.redirect('/404');
}

const product = productResponse.data;

// 3. Validación de negocio: producto debe pertenecer a la categoría de la URL
if (product.categoryId !== categorySlug) {
  return Astro.redirect('/404');
}

const productTitle = product.title[lang] || product.title.es;
---

<Layout
  title={`${productTitle} | AutoUI`}
  lang={lang}
  description={product.description?.[lang]}
  image={product.image}
>
  <main class="py-12">
    <ProductDetail product={product} lang={lang} />
  </main>
</Layout>
```

---

## 4. Checklist de Validación para el Coder

- [ ] ¿La página está ubicada bajo la estructura `src/pages/[lang]/...`?
- [ ] ¿Valida `Astro.params.lang` y redirige a `/404` si el idioma no es válido?
- [ ] ¿Las consultas de datos se ejecutan a través de `Astro.callAction(actions.<accion>, ...)`?
- [ ] ¿Valida la existencia del recurso y redirige a `/404` si no se encuentra?
- [ ] ¿Envuelve todo el contenido dentro de `<Layout title={...} lang={...}>`?
- [ ] ¿Delega la presentación a componentes/secciones en lugar de escribir todo el marcado inline?
