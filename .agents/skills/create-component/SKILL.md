---
name: create-component
description: Creates or updates pure presentation Astro components, sections, and global UI elements following AutoUI conventions, Tailwind CSS v4, i18n content loading, and ClientRouter astro:page-load lifecycle.
---

# Create Component Skill

Esta skill define las reglas, patrones y estándares para crear y organizar componentes visuales en **AutoUI** (`src/components/`).

---

## 1. Responsabilidad y Ubicación

Los componentes de AutoUI son **presentación pura**. No consultan bases de datos ni ejecutan lógica de negocio compleja.

### Estructura de Directorios
```plaintext
src/components/
├── common/                       # Componentes globales compartidos
│   ├── Navbar.astro              # Barra de navegación principal con menú y submenús i18n
│   ├── Footer.astro              # Pie de página y enlaces legales
│   └── ...                       # Modales globales, banners, carruseles compartidos
└── <pagina>/                     # Componentes específicos de una vista (ej. home/, category/, product/)
    ├── sections/                 # Bloques completos de la página (Hero.astro, FAQ.astro, Features.astro)
    └── components/               # Subcomponentes atómicos (ProductCard.astro, AccordionItem.astro)
```

---

## 2. Reglas Inquebrantables de Componentes

1. **Presentación Pura y Desacoplada**:
   - Cero consultas a base de datos o APIs remotas directas dentro del componente.
   - Todo dato dinámico debe recibirse mediante `Astro.props`.
2. **Carga de Contenido i18n**:
   - Los textos estáticos de la interfaz se leen desde `src/data/site-<pagina>-content.json` indexados por el idioma `lang` recibido por props (ej. `content[lang].hero`).
   - Los textos compartidos provienen de `src/data/site-global-content.json`.
3. **Props Fuertemente Tipados**:
   - Cada componente debe declarar una interfaz `Props` explícita en su frontmatter (`---`).
   - Propiedad obligatoria cuando renderiza textos localizados: `lang: Lang`.
4. **Estilos con Tailwind CSS v4**:
   - Usar clases utilitarias modernas de Tailwind CSS v4.
   - Mantener estilos encapsulados o limpios, evitando CSS inline innecesario.
5. **Interactividad Compatible con `ClientRouter`**:
   - Si el componente incluye scripts de cliente (`<script>`), **DEBE** escuchar el evento `astro:page-load` además de su inicialización inicial para garantizar funcionamiento correcto durante la navegación SPA de Astro.
   ```typescript
   function init() {
     // Configuración de listeners / animaciones
   }
   init();
   document.addEventListener('astro:page-load', init);
   ```

---

## 3. Plantillas de Código

### A. Sección de Página (`src/components/<pagina>/sections/Hero.astro`)

```astro
---
// src/components/home/sections/Hero.astro
import type { Lang } from '../../../i18n/config.i18n';
import homeContent from '../../../data/site-example-content.json';

interface Props {
  lang: Lang;
  ctaActionUrl?: string;
}

const { lang, ctaActionUrl = `/${lang}/contact` } = Astro.props;
const t = homeContent[lang] ?? homeContent.es;
---

<section class="relative overflow-hidden py-24 sm:py-32 bg-slate-950 text-white">
  <div class="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
    
    <!-- Tag / Badge -->
    <span class="inline-flex items-center gap-x-2 rounded-full px-4 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 ring-1 ring-inset ring-cyan-500/20 mb-8">
      {t.hero?.tag ?? "Nuevo"}
    </span>

    <!-- Título Principal -->
    <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
      {t.hero?.title}
    </h1>

    <!-- Subtítulo -->
    <p class="mt-6 text-lg leading-8 text-slate-300 max-w-2xl">
      {t.hero?.subtitle}
    </p>

    <!-- CTAs -->
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a
        href={ctaActionUrl}
        class="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-md hover:bg-cyan-400 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {t.hero?.ctaText ?? "Comenzar"}
      </a>
    </div>

  </div>
</section>
```

### B. Subcomponente Atómico con Script de Cliente (`src/components/<pagina>/components/Card.astro`)

```astro
---
// src/components/products/components/ProductCard.astro
import type { Lang } from '../../../../i18n/config.i18n';

export interface ProductData {
  id: string;
  slug: string;
  title: Record<string, string>;
  price: number;
  image: string;
}

interface Props {
  product: ProductData;
  lang: Lang;
  categorySlug: string;
}

const { product, lang, categorySlug } = Astro.props;
const localizedTitle = product.title[lang] || product.title.es;
const productHref = `/${lang}/${categorySlug}/${product.slug}`;
---

<article class="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:shadow-lg">
  <div class="aspect-square w-full overflow-hidden rounded-xl bg-slate-800">
    <img
      src={product.image}
      alt={localizedTitle}
      loading="lazy"
      class="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
    />
  </div>

  <div class="mt-4 flex justify-between items-start">
    <div>
      <h3 class="text-base font-semibold text-white">
        <a href={productHref}>
          <span aria-hidden="true" class="absolute inset-0"></span>
          {localizedTitle}
        </a>
      </h3>
    </div>
    <p class="text-base font-bold text-cyan-400">
      ${product.price.toFixed(2)}
    </p>
  </div>
</article>
```

### C. Componente con Interactividad (Eventos `astro:page-load`)

```astro
---
// src/components/common/Accordion.astro
interface Props {
  items: { id: string; question: string; answer: string }[];
}

const { items } = Astro.props;
---

<div class="accordion-container w-full space-y-4">
  {items.map((item) => (
    <div class="border border-slate-800 rounded-xl overflow-hidden">
      <button
        type="button"
        class="accordion-trigger w-full px-6 py-4 text-left font-medium text-white flex justify-between items-center bg-slate-900 hover:bg-slate-800 transition"
        data-target={`#accordion-content-${item.id}`}
      >
        <span>{item.question}</span>
        <span class="icon transform transition-transform">+</span>
      </button>
      <div id={`accordion-content-${item.id}`} class="accordion-content hidden px-6 py-4 text-slate-300 bg-slate-950 text-sm">
        {item.answer}
      </div>
    </div>
  ))}
</div>

<script>
  function setupAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-target');
        if (!targetId) return;
        const content = document.querySelector(targetId);
        content?.classList.toggle('hidden');
      });
    });
  }

  setupAccordion();
  document.addEventListener('astro:page-load', setupAccordion);
</script>
```

---

## 4. Checklist de Validación para el Coder

- [ ] ¿El componente está en la ubicación correcta (`common/`, `<pagina>/sections/`, o `<pagina>/components/`)?
- [ ] ¿Declara una interfaz `Props` estricta con tipado de TypeScript?
- [ ] ¿Es de presentación pura (sin llamadas directas a BD o APIs externas)?
- [ ] ¿Utiliza clases utilitarias de Tailwind CSS v4?
- [ ] Si usa `<script>`, ¿incluye el listener `astro:page-load` para compatibilidad con ClientRouter?
