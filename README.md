# 🚀 AutoUI Starter Kit (`autroui`)

> **Starter kit de alto rendimiento para el desarrollo ágil de sitios web modernos, landing pages dinámicas, catálogos por categoría y plataformas e-commerce multilingües.**  
> Construido con **Astro (SSR)**, **Tailwind CSS v4**, **TypeScript**, soporte nativo para **Cloudflare** y un sistema de internacionalización (**i18n**) estricto y preconfigurado. Incluye además un ecosistema de agentes autónomos y skills para acelerar el desarrollo con IA.

---

## ⚡ Inicio Rápido

### Crear un nuevo proyecto con la plantilla oficial

```bash
npm create astro@latest mi-proyecto -- --template KEVIN01306/autroui
```

### O clonar e instalar manualmente en local

```bash
# 1. Clonar el repositorio o ingresar al directorio
cd landing-starter-kit

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev
```

El sitio estará disponible en [http://localhost:4321](http://localhost:4321).

---

## 🛠️ Stack Tecnológico

| Herramienta / Tecnología | Versión | Rol en el Proyecto |
| :--- | :--- | :--- |
| **[Astro](https://astro.build)** | `^6.1.6` | Framework principal en modo SSR (`output: 'server'`) con ClientRouter. |
| **[Tailwind CSS](https://tailwindcss.com)** | `^4.2.2` | Motor de estilos de última generación integrado mediante `@tailwindcss/vite`. |
| **[Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)** | `^13.1.9` | Adaptador oficial de ejecución y despliegue edge en Cloudflare Pages / Workers. |
| **[TypeScript](https://www.typescriptlang.org/)** | Strict | Tipado estricto con configuración preestablecida de Astro. |
| **[Astro Actions](https://docs.astro.build/en/guides/actions/)** | Nativo | Server Actions para consultas y mutaciones de datos fuertemente tipadas. |
| **[Astro Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** | `^3.7.3` | Generación dinámica de sitemap multilingüe y URLs SEO canónicas. |
| **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** | `^4.82.2` | CLI y runtime de Cloudflare para tipos locales y despliegue. |

---

## 📂 Arquitectura y Estructura del Proyecto

AutoUI sigue una separación estricta de responsabilidades en 5 capas:

```plaintext
├── public/
│   ├── images/                           # Galería modular de imágenes
│   │   ├── home/                         # Recursos visuales del Home
│   │   └── <categoria>/                  # Recursos por categoría / módulo
│   │       ├── banner.png (o hero.png)
│   │       ├── logo.png
│   │       └── products/                 # Imágenes de productos (<slug>.png)
│   └── favicon.svg
│
├── src/
│   ├── actions/                          # Capa de Servidor (Astro Server Actions)
│   │   ├── index.ts                      # Registro central (export const server = { ... })
│   │   └── <modulo>/                     # Módulos por dominio (ej. reviews/, products/)
│   │       └── <accion>.action.ts        # Acciones tipadas (Promise<{ message, data }>)
│   │
│   ├── components/                       # Capa Visual (Presentación Pura)
│   │   ├── common/                       # Componentes globales (Navbar.astro, Footer.astro)
│   │   ├── ui/                           # Primitivas de interfaz
│   │   └── <pagina>/                     # Componentes específicos de una vista
│   │       ├── sections/                 # Bloques completos de página (Hero.astro, FAQ.astro)
│   │       └── components/               # Subcomponentes atómicos (Card.astro)
│   │
│   ├── data/                             # Capa de Contenido y Datos
│   │   ├── site-global-content.json      # Navegación (Navbar con submenús) y Footer
│   │   ├── site-<pagina>-content.json    # Copys de interfaz indexados por idioma ("es", "en")
│   │   └── <modulo>/                     # Colecciones de entidades locales
│   │       └── <modulo>.data.json        # Datos estructurados en plural (products.data.json)
│   │
│   ├── db/                               # Capa de Persistencia (Opcional / Extensible)
│   │   ├── index.ts                      # Cliente de base de datos
│   │   ├── schema.ts                     # Definiciones de esquema
│   │   └── repositories/                 # Repositorios de acceso a datos
│   │
│   ├── i18n/                             # Configuración y Helpers de Internacionalización
│   │   ├── config.i18n.ts                # Idiomas soportados ('es', 'en') y tipo Lang
│   │   └── utils.i18n.ts                 # Funciones helper (useTranslations, getLangFromUrl)
│   │
│   ├── layouts/                          # Plantillas Estructurales
│   │   └── Layout.astro                  # Head, Open Graph, SEO, Twitter Cards y ClientRouter
│   │
│   ├── pages/                            # Enrutamiento basado en archivos
│   │   ├── index.astro                   # Redirección raíz hacia el idioma por defecto (/es)
│   │   ├── 404.astro                     # Manejador de páginas y recursos no encontrados
│   │   └── [lang]/                       # Rutas dinámicas multilenguaje
│   │       ├── index.astro               # Home principal
│   │       └── [category]/               # Vistas anidadas
│   │           ├── index.astro           # Vista de categoría / Catálogo
│   │           └── [product]/
│   │               └── index.astro       # Ficha y detalle de producto
│   │
│   ├── styles/                           # Estilos Globales
│   │   └── global.css                    # Tailwind CSS v4 (@import "tailwindcss";)
│   │
│   └── utils/                            # Utilidades Puras
│       └── seo/
│           └── sitemapUrls.ts            # Generador dinámico de URLs para el sitemap
│
├── .agents/                              # Sistema Multi-Agente y Memoria (IA)
├── ARCHITECTURE.md                       # Especificación técnica detallada
├── AGENTS.md                             # Orquestación de Agentes para LLMs
└── CLAUDE.md                             # Contexto y directrices de desarrollo
```

---

## 📖 Guía de Uso del Template

### 1. Internacionalización y Copys (`src/data/` y `src/i18n/`)

AutoUI tiene activado `prefixDefaultLocale: true` en `astro.config.mjs`, lo que significa que todas las rutas públicas llevan el prefijo de idioma (ej. `/es/` o `/en/`).

- **Simetría obligatoria**: En cualquier archivo `site-<pagina>-content.json`, las claves deben ser idénticas para `"es"` y `"en"`.
- **Navegación con submenús**: En `src/data/site-global-content.json`, el Navbar soporta enlaces con hijos (`children`), que el componente `Navbar.astro` renderiza automáticamente como submenús desplegables.

```json
{
  "es": {
    "brandName": "Mi Tienda",
    "hero": {
      "title": "Bienvenido a AutoUI",
      "subtitle": "La forma más rápida de lanzar tu web"
    }
  },
  "en": {
    "brandName": "My Store",
    "hero": {
      "title": "Welcome to AutoUI",
      "subtitle": "The fastest way to launch your site"
    }
  }
}
```

---

### 2. Server Actions (`src/actions/`)

Toda consulta de datos o mutación (envío de formularios, filtros, obtención de productos) se maneja mediante Server Actions de Astro:

1. **Crea la acción** en `src/actions/<modulo>/<nombre>.action.ts`:
   ```typescript
   import { defineAction } from 'astro:actions';
   import { z } from 'astro:schema';
   import productsData from '../../data/products/products.data.json';

   export const getProducts = defineAction({
     input: z.object({ categoryId: z.string().optional() }),
     handler: async ({ categoryId }): Promise<{ message: string; data: any[] }> => {
       const list = categoryId 
         ? productsData.products.filter(p => p.categoryId === categoryId)
         : productsData.products;
       return { message: "Productos obtenidos con éxito", data: list };
     }
   });
   ```
2. **Regístrala** en `src/actions/index.ts`:
   ```typescript
   import { getProducts } from './products/getProducts.action';

   export const server = {
     getProducts,
   };
   ```
3. **Consúmela en la página Astro**:
   ```astro
   ---
   import { actions } from 'astro:actions';
   const { data: response } = await Astro.callAction(actions.getProducts, { categoryId: 'calzado' });
   const products = response?.data ?? [];
   ---
   ```

---

### 3. Componentes Visuales y Tailwind CSS v4 (`src/components/`)

- **Presentación Pura**: Los componentes no contienen lógica de base de datos ni mutaciones directas. Reciben copys por `lang` y datos por props.
- **Tailwind CSS v4**: Utiliza sintaxis moderna de clases utilitarias de Tailwind v4 configurada desde `src/styles/global.css`.
- **ClientRouter**: Si tu componente tiene interactividad en cliente (`<script>`), escucha `astro:page-load`:

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<div class="interactive-card bg-slate-900 p-6 rounded-2xl border border-slate-800">
  <h3 class="text-xl font-bold text-white">{title}</h3>
  <button id="toggle-btn" class="mt-4 px-4 py-2 bg-cyan-500 rounded-lg text-black font-semibold">
    Interactuar
  </button>
</div>

<script>
  function setup() {
    const btn = document.getElementById('toggle-btn');
    btn?.addEventListener('click', () => alert('¡Acción ejecutada!'));
  }
  setup();
  document.addEventListener('astro:page-load', setup);
</script>
```

---

### 4. Creación de Páginas Multilenguaje (`src/pages/[lang]/`)

Las páginas dinámicas viven en `src/pages/[lang]/...`. En el frontmatter:
1. Extraes `Astro.params`.
2. Validas que `lang` exista; si no, rediriges a `/404`.
3. Ejecutas las Server Actions necesarias.
4. Envuelves la vista en `<Layout title={...} lang={...}>`.

```astro
---
import Layout from '../../layouts/Layout.astro';
import { LANGUAGES, type Lang } from '../../i18n/config.i18n';
import content from '../../data/site-example-content.json';

const lang = Astro.params.lang as Lang;

if (!(lang in LANGUAGES) || !(lang in content)) {
  return Astro.redirect('/404');
}

const t = content[lang];
---

<Layout title={t.brandName} lang={lang} description="Descripción SEO">
  <main class="min-h-screen py-12 px-6">
    <h1 class="text-4xl font-bold text-white text-center">{t.hero.title}</h1>
  </main>
</Layout>
```

---

### 5. Convención Modular de Imágenes (`public/images/`)

Guarda tus archivos multimedia siguiendo este orden:
- **Home / Global**: `public/images/home/` o `public/icon.png`
- **Banner de categoría**: `public/images/<categoria>/banner.png` (o `hero.png`)
- **Logo de categoría**: `public/images/<categoria>/logo.png`
- **Imágenes de producto**: `public/images/<categoria>/products/<slug-o-sku>.png`

---

## 🏗️ Estructura Predefinida: Catálogo / E-commerce (`site_category_products`)

El kit está especialmente preparado para desplegar la estructura `site_category_products`:
- **Vista Home** (`src/pages/[lang]/index.astro`): Banner principal, categorías destacadas y opiniones.
- **Vista Categoría** (`src/pages/[lang]/[category]/index.astro`): Hero de la categoría y catálogo filtrado de productos.
- **Vista Producto** (`src/pages/[lang]/[category]/[product]/index.astro`): Ficha técnica, galería de fotos, detalles y validación de pertenencia a la categoría.

---

## 🤖 Desarrollo Acelerado con IA (Agentes y Skills)

Este repositorio incluye una suite integrada de agentes de desarrollo en `.agents/`:

- **Manager** ([`.agents/agents/manager/SKILL.md`](.agents/agents/manager/SKILL.md)): Analiza requerimientos, pide referencias de diseño (Figma) y planifica tareas en orden.
- **Coder** ([`.agents/agents/coder/SKILL.md`](.agents/agents/coder/SKILL.md)): Implementa código respetando las 4 skills de AutoUI.
- **Tester** ([`.agents/agents/tester/SKILL.md`](.agents/agents/tester/SKILL.md)): Audita arquitectura, simetría i18n, pureza de componentes y valida la compilación.

### Skills Especializadas Disponibles
- **`create-data`**: Creación de diccionarios i18n y entidades `.data.json`.
- **`create-action`**: Creación y tipado de Server Actions en `src/actions/`.
- **`create-component`**: Componentes visuales puros con Tailwind CSS v4 y `astro:page-load`.
- **`create-page`**: Páginas dinámicas multilenguaje bajo `src/pages/[lang]/`.

---

## 📜 Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:4321`. |
| `npm run build` | Compila el proyecto para producción en Cloudflare (carpeta `dist/`). |
| `npm run preview` | Ejecuta localmente la versión compilada para pruebas previas. |
| `npm run generate-types` | Genera los tipos de Cloudflare Workers / Wrangler (`wrangler types`). |
| `npm run astro -- --help` | Consulta la ayuda general de la CLI de Astro. |

---

## ☁️ Despliegue en Cloudflare Pages

El starter kit ya está configurado con `@astrojs/cloudflare` en modo SSR (`output: 'server'`).

### Despliegue con Wrangler CLI
```bash
npx wrangler pages deploy dist
```

### Despliegue desde Git (GitHub / GitLab)
Configura en el panel de **Cloudflare Pages**:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Framework preset**: `Astro`
- **Node.js Version**: `>= 22.12.0` (definir variable de entorno `NODE_VERSION = 22.12.0`)

---

## 📄 Licencia

Este starter kit es de código abierto bajo la licencia **MIT**. Desarrollado y mantenido por [Kevin Sánchez](https://github.com/KEVIN01306).
