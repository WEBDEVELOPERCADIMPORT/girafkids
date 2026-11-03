# MEMORY.md — Registro Central del Proyecto AutoUI (autroui)

> **Propósito**: Este archivo es la fuente de verdad sobre el estado actual, arquitectura, módulos, datos, acciones y componentes del starter kit **AutoUI (autroui)**.
> **Regla Inquebrantable**: Todo agente (`manager`, `coder`, `tester`) debe consultar este documento antes de planificar o modificar código, y el `manager` debe actualizarlo tras cada tarea verificada por el `tester`.

---

## 1. Identidad y Propósito del Starter Kit

- **Nombre**: AutoUI (`autroui`)
- **Template / Origen**: `KEVIN01306/autroui`
- **Propósito**: Starter kit de alto rendimiento y arquitectura modular para la creación, desarrollo y mantenimiento acelerado de sitios web modernos, landing pages, catálogos dinámicos por categoría y soluciones e-commerce multilingües.
- **Enfoque Principal**: Separación estricta entre presentación visual (componentes desacoplados en Astro), lógica de datos en el servidor (Astro Server Actions), contenidos estructurados internacionalizados (JSONs simétricos `es`/`en`) y despliegue edge en Cloudflare.

---

## 2. Stack Tecnológico y Configuración

- **Framework**: Astro `^6.1.6` (modo SSR: `output: 'server'`, con `@astrojs/cloudflare` `^13.1.9`).
- **Estilos**: Tailwind CSS `^4.2.2` integrado vía `@tailwindcss/vite` (`@import "tailwindcss";` en `src/styles/global.css`).
- **Lenguaje**: TypeScript (`strict` mode con `astro/tsconfigs/strict`).
- **Navegación e Interactividad**: Astro `ClientRouter` nativo; los scripts de cliente se inicializan en carga y en el evento `astro:page-load`.
- **Internacionalización (i18n)**:
  - Idiomas soportados: Español (`es`) e Inglés (`en`).
  - Configuración: `astro.config.mjs` con `prefixDefaultLocale: true`, fallback y redirección automática.
  - Diccionarios y helpers en `src/i18n/config.i18n.ts` y `src/i18n/utils.i18n.ts`.
- **SEO & Metadatos**:
  - `@astrojs/sitemap` con generación dinámica de URLs (`src/utils/seo/sitemapUrls.ts`).
  - `src/layouts/Layout.astro` con soporte para Open Graph, Twitter Cards, canonical tags, alternate hreflang y JSON-LD (`schema`).
- **Hosting / Deploy**: Cloudflare Pages / Workers (`wrangler` `^4.82.2`).

---

## 3. Mapa de Arquitectura y Capas

```plaintext
public/
└── images/                               # Galería estática de medios y recursos visuales
    ├── home/                             # Assets globales y de la página principal
    └── <categoria>/                      # Assets organizados por módulo/categoría
        ├── banner.png (o hero.png)
        ├── logo.png
        └── products/                     # Imágenes de productos de la categoría
            └── <slug-o-sku>.png

src/
├── actions/                              # Astro Server Actions (Lógica de servidor)
│   ├── index.ts                          # Registro central export const server = { ... }
│   └── <modulo>/                         # Módulos por dominio (ej. reviews/, products/)
│       └── <nombre>.action.ts
│
├── components/                           # Presentación pura (sin queries ni mutaciones)
│   ├── common/                           # UI global compartida (Navbar.astro, Footer.astro)
│   ├── ui/                               # Primitivas de UI
│   └── <pagina>/                         # Componentes de páginas específicas
│       ├── sections/                     # Bloques de sección completos (Hero.astro, FAQ.astro)
│       └── components/                   # Subcomponentes atómicos (Card.astro)
│
├── data/                                 # Contenido centralizado y fuentes locales
│   ├── site-global-content.json          # Textos compartidos, Navbar (con submenús) y Footer
│   ├── site-<pagina>-content.json        # Textos de página indexados por idioma ("es", "en")
│   └── <modulo>/                         # Colecciones de datos locales
│       └── <modulo>.data.json            # Entidades en plural (ej. products.data.json)
│
├── db/                                   # Capa de persistencia (opcional / extensible)
│   ├── index.ts                          # Cliente de base de datos
│   ├── schema.ts                         # Definición de tablas / esquemas
│   └── repositories/                     # Repositorios de acceso a datos
│
├── i18n/                                 # Configuración y utilidades de internacionalización
│   ├── config.i18n.ts                    # Constantes de idiomas y tipo Lang
│   └── utils.i18n.ts                     # Funciones utilitarias (getLangFromUrl, useTranslations)
│
├── layouts/                              # Plantillas maestras
│   └── Layout.astro                      # Head, SEO, metadatos y ClientRouter
│
├── pages/                                # Enrutamiento basado en archivos
│   ├── index.astro                       # Redirección raíz hacia /[defaultLocale]
│   ├── 404.astro                         # Página de error 404
│   └── [lang]/                           # Enrutamiento dinámico multilenguaje
│       ├── index.astro                   # Vista Home
│       └── [category]/                   # Vistas anidadas
│           ├── index.astro               # Catálogo / Vista de Categoría
│           └── [product]/
│               └── index.astro           # Detalle / Ficha de Producto
│
├── styles/                               # Estilos globales
│   └── global.css                        # Tailwind CSS v4 (@import "tailwindcss";)
│
└── utils/                                # Utilidades puras
    └── seo/
        └── sitemapUrls.ts                # Extractor dinámico de rutas para el sitemap
```

---

## 4. Estructuras de Sitio Predefinidas

### 1. `site_category_products` (E-commerce / Catálogo Dinámico)
- **Propósito**: Navegación multinivel por categorías y catálogo con ficha técnica detallada.
- **Páginas requeridas**:
  - Home: `src/pages/[lang]/index.astro`
  - Categoría: `src/pages/[lang]/[category]/index.astro`
  - Producto: `src/pages/[lang]/[category]/[product]/index.astro`
- **Datos requeridos** (`src/data/`):
  - `categories/categories.data.json`
  - `products/products.data.json`
  - `site-home-content.json`
- **Requerimiento de Insumos Visuales (Figma / Mockups)**:
  - Vista Home (Layout principal y secciones).
  - Vista Categoría (Hero de categoría y cuadrícula de productos).
  - Vista Producto (Ficha técnica, galería de imágenes y detalles).

---

## 5. Módulos y Estado Actual del Starter Kit

| Módulo / Capa | Directorio / Archivo | Estado | Descripción |
| :--- | :--- | :--- | :--- |
| **Global Layout & SEO** | `src/layouts/Layout.astro` | Activo | Plantilla base con Open Graph, Twitter Cards, `ClientRouter` y tema cálido Girafkids. |
| **Tema & Variables Visuales** | `src/styles/global.css` | Activo | Configuración de variables del tema (naranja, terracota, crema, marrón cálido) y utilidades. |
| **Internacionalización** | `src/i18n/` | Activo | Idiomas `es` y `en` con helpers de traducción y rutas. |
| **Navbar & Footer** | `src/components/common/` | Activo | Navegación global con botón Amazon y Footer terracota de 3 columnas. |
| **Home Sections** | `src/components/home/sections/` | Activo | Hero, TrustReasons (5 razones), ProductShowcase (4 productos), KidsEnergyBanner, Reviews, StoreLocator, FAQ. |
| **Product Sections** | `src/components/product/sections/` | Activo | ProductDetail (galería interactiva, bullets, acordeones técnicos) y ComplementaryProducts (cross-selling). |
| **Products Action & Data** | `src/actions/products/`, `src/data/products/` | Activo | Acciones `getProducts`, `getProductBySlug` y catálogo `products.data.json`. |
| **Store Locator Action & Data** | `src/actions/stores/`, `src/data/stores/` | Activo | Acción `getStores` con filtro por ZIP y 5 sucursales de Quintana Roo. |
| **Reviews Action & Data** | `src/actions/reviews/`, `src/data/reviews/` | Activo | Acción `getReviews` con puntuación 4.8 y testimonios pediátricos. |
| **Home Page** | `src/pages/[lang]/index.astro` | Activo | Página principal completa con llamadas `Astro.callAction` y Layout. |
| **Product Detail Page** | `src/pages/[lang]/products/[slug].astro` | Activo | Ficha técnica y compra directa en Amazon sin página intermedia de categorías. |
| **Error Handling** | `src/pages/404.astro` | Activo | Vista estándar 404 para rutas o idiomas inválidos. |
| **Sitemap Dinámico** | `src/utils/seo/sitemapUrls.ts` | Activo | Inyección de URLs localizadas en `@astrojs/sitemap`. |

---

## 6. Convenciones y Reglas Inquebrantables

1. **Presentación Pura en Componentes**:
   - `src/components/` jamás realiza llamadas directas a base de datos ni mutaciones; recibe datos por props y textos por `lang`.
2. **Server Actions como Única Vía de Datos Dinámicos**:
   - Se crean en `src/actions/<modulo>/<accion>.action.ts` y se registran en `src/actions/index.ts`.
   - Tipado estricto `Promise<{ message: string, data: T }>`. Cero HTML devuelto.
3. **Simetría Multilenguaje Estricta**:
   - En `src/data/`, cada clave en `"es"` debe existir exactamente igual en `"en"`.
4. **Validación de Idioma en Páginas**:
   - Toda página bajo `src/pages/[lang]/` valida que `lang` pertenezca a `LANGUAGES` y redirige a `/404` si no existe.
5. **ClientRouter y Scripts**:
   - Todo script en componentes que añada interactividad debe suscribirse a `astro:page-load`.
6. **Convención Modular de Imágenes**:
   - Toda imagen se almacena en `public/images/<categoria>/...` o `public/images/home/`.

---

## 7. Catálogo de Agentes y Skills del Proyecto

### Agentes (`.agents/agents/`)
- **`manager`**: Líder técnico y orquestador. Confirma insumos visuales, estructura las tareas (`#Task-XX`), asigna skills y coordina con el `tester`.
- **`coder`**: Desarrollador enfocado. Implementa una tarea a la vez en modo `triage` o `implement` siguiendo las skills de AutoUI.
- **`tester`**: Auditor de calidad y arquitectura. Valida tipos, build y cumplimiento estricto de las reglas arquitectónicas de AutoUI.

### Skills Técnicas (`.agents/skills/`)
- **`create-data`**: Creación de diccionarios i18n (`site-<pagina>-content.json`), configuración global y entidades locales (`.data.json`).
- **`create-action`**: Creación y tipado de Server Actions en `src/actions/` y registro en `index.ts`.
- **`create-component`**: Componentes visuales puros con Tailwind CSS v4, carga de copys por `lang` y scripts con `astro:page-load`.
- **`create-page`**: Páginas dinámicas multilenguaje bajo `[lang]`, validación con redirección 404, llamadas `Astro.callAction` y Layout SEO.

---

## 8. Historial de Cambios (Changelog)

| Fecha | Identificador | Capa | Resumen del Cambio | Verificado Por |
| :--- | :--- | :--- | :--- | :--- |
| 2026-11-03 | `#Girafkids-Backend-Centralized-Services` | Services & Server Actions | Creación de capa `src/services/products.service.ts` conectada al Backend Centralizado (`BACKEND_API_URL` y `BACKEND_API_KEY` vía `import.meta.env`) consumiendo dinámicamente endpoints `/content/products-es` y `/content/products-en` con filtro por slug, mapeo normalizado a `LocalizedProductItem` y fallback local seguro, desacoplando Server Actions `getProducts` y `getProductBySlug`. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Details-List-NoCertification` | Data & UI Refactor | Eliminación de `certification` y conversión de `details` de objeto a una lista/array dinámico (`ProductDetailItem[]` con `title`, `content` e `icon`) en `products.data.json`, `getProducts.action.ts`, `site-product-content.json` y `ProductDetail.astro`, permitiendo renderizado dinámico de acordeones sin valores fijos ni emojis. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-ProductDescription-SeeMoreToggle` | Data & UI Interactive | Remoción de `shortDescription` y `showcaseDescription` en los datos de producto y componentes; agregado de toggles interactivos "Ver más" / "Ver menos" con soporte i18n (`site-home-content.json` y `site-product-content.json`) en cards de producto y en ProductDetail, preservando la sincronización en `astro:page-load`. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Navbar-Mobile-Lang` | UI Presentation | Remoción del botón Amazon en el Navbar, rediseño del selector de idioma tipo píldora interactiva con estados activo/inactivo (ES/EN) e implementación de menú móvil hamburguesa responsive accesible con drawer desplegable y soporte `astro:page-load`. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Details-NoEmojis` | UI Refactor | Reemplazo de todos los emojis en los acordeones de detalles de producto (Modo de uso, Ingredientes y Certificación) por íconos vectoriales SVG profesionales con estilo de marca en `ProductDetail.astro`. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Shared-Images-List` | Data & UI Sync | Unificación de la lista `images: string[]` en `products.data.json` compartida entre el mini-carrusel de la card de producto en Home y el selector de imágenes de ProductDetail, manteniendo removidas las estrellas y stock disponible. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Products-Clean-i18n-Split` | Data & UI Refactor | Reestructuración de productos duplicados por idioma `products: { es: [...], en: [...] }` en `products.data.json`, eliminación completa de estrellas, thumbnails y badge de stock disponible tanto en Home (cards) como en Product Detail y Cross-selling. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-CleanMap-Iframe` | UI Presentation | Remoción de la barra superior de botones/pills del mapa en `StoreLocator.astro`, dejando el iframe de Google Maps limpio a altura completa sincronizado directamente con la lista de sucursales y buscador ZIP. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-GoogleMaps-Iframe-Sync` | UI & Client Interaction | Integración de Google Maps en iframe dentro de StoreLocator con paso dinámico de las 5 direcciones de Quintana Roo, selector interactivo con quick-pills, centrado y remarcado de sucursal activa y sincronización con el buscador por código ZIP. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Products-Carousel-Figma` | UI Presentation | Implementación de carrusel horizontal para la vitrina de productos con navegación por botones prev/next, diseño exacto de tarjetas según Figma (bordes suaves `rounded-[28px]`, estrellas con rating, botón naranja "Ver en Amazon ↗" y botón crema "Ver detalles"), junto con mini-carrusel de imágenes interno por cada producto. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Typography-SourGummy` | UI Theme | Integración global de la tipografía oficial 'Sour Gummy' (Google Fonts) en `Layout.astro` y `global.css`, aplicada a body, headings, botones e inputs para reflejar la identidad visual infantil y lúdica de la marca. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-CommonReviews-Figma-Sync` | UI Presentation | Actualización del componente `src/components/common/Reviews.astro` con la paleta de colores de Girafkids, header de Amazon Reviews idéntico a la imagen (4.8 en verde oscuro, estrellas, "+2,450 valoraciones" e imagen oficial de Amazon Reviews), carrusel interactivo y vinculación directa en `src/pages/[lang]/index.astro`. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-BannerChildren-Sync` | UI & Data | Integración del banner promocional unificado con imagen de fondo `banner-children.png` (los 3 niños y rayos de sol) y superposición de texto H2 traducible y dinámico desde `site-home-content.json` ("SALUD PARA LOS MÁS PEQUEÑOS." / "HEALTH FOR THE LITTLE ONES."). | Tester AutoUI |
| 2026-11-03 | `#Girafkids-TrustReasons-Figma-Sync` | UI & Data | Rediseño asimétrico exacto de la sección 5 Razones para Confiar: Card 01 grande naranja destacada (matraz, badge NUTRICIÓN PURA, número 01, Biodisponible & Suave y Grado Premium) + Grid 2x2 para las cards 02-05 con números en pastel, íconos temáticos y tags con viñeta naranja, con textos 100% dinámicos en `site-home-content.json`. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Hero-Mask-i18n` | UI & Data | Implementación de máscara de contraste enfrente del fondo de los niños (`bg-children.png`), y desacoplamiento y traducción completa al 100% de los textos de la card action en `src/data/site-home-content.json` para español e inglés sin textos quemados. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Hero-Animation-Spacing` | UI Presentation | Ajuste de espaciado `justify-between` entre la jirafa y la card del Hero, animación continua flotante vertical (abajo hacia arriba) y resplandor/sombra amarilla alrededor de la jirafa. | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Hero-Figma-Sync` | UI Presentation | Actualización del Hero con las imágenes de fondo `bg-children.png`, fondo de card `bg-card-action.png` y la mascota `giraffe-hero.png`, tipografía idéntica al Figma y botones de acción (naranja con bolsa y blanco con flecha hacia abajo). | Tester AutoUI |
| 2026-11-03 | `#Girafkids-Landing-Products` | Fullstack AutoUI | Implementación completa de Girafkids: tema visual cálido en `global.css`, buscador de tiendas por código ZIP con 5 sucursales de Quintana Roo, reviews pediátricos 4.8 con logo Amazon, catálogo de 4 productos, vista Home completa, vista Detalle de Producto (`/[lang]/products/[slug]`), Server Actions tipadas y soporte multilenguaje (`es`/`en`). | Tester AutoUI |
| 2026-10-26 | `#Init-AutoUI-Agents` | Sistema de Agentes | Reconfiguración completa del ecosistema multi-agente (`manager`, `coder`, `tester`), catálogo de skills (`create-data`, `create-action`, `create-component`, `create-page`), actualización de `MEMORY.md`, `AGENTS.md` y `CLAUDE.md` orientados al starter kit AutoUI (Astro, Tailwind CSS v4, i18n, Cloudflare). | Manager AutoUI |
