---
name: create-data
description: Creates or updates centralized content JSONs, i18n text dictionaries (site-<pagina>-content.json, site-global-content.json), and local entity data files in src/data/ following AutoUI architecture.
---

# Create Data Skill

Esta skill define las reglas, estándares y plantillas para crear y mantener la capa de datos y contenidos en **AutoUI** (`src/data/`).

---

## 1. Responsabilidad y Ubicación

Toda la información estática, textos de interfaz multilenguaje y colecciones de datos locales deben residir exclusivamente en `src/data/`.

### Estructura de Archivos
```plaintext
src/data/
├── site-global-content.json               # Textos globales, enlaces del Navbar (con soporte submenú) y Footer
├── site-<pagina>-content.json             # Contenido, copys y textos por página indexados por idioma ("es", "en")
└── <entidad>/                             # Datos locales de entidades de dominio
    └── <entidad>.data.json                # Colección de datos (ej. products.data.json, categories.data.json)
```

---

## 2. Reglas Inquebrantables de Datos

1. **Espejo Estricto de Idiomas (`es` y `en`)**:
   - Todo archivo de contenido de página (`site-<pagina>-content.json`) y global (`site-global-content.json`) **DEBE** contener nodos espejo idénticos para cada idioma soportado en `src/i18n/config.i18n.ts` (`es`, `en`).
   - Las claves, estructura y tipos de datos deben ser exactamente iguales entre `es` y `en`.
2. **Cero Marcado HTML o Lógica en JSON**:
   - Los JSON solo contienen strings limpios, números, booleanos, arrays u objetos de datos.
   - Jamás incluyas tags HTML (`<div>`, `<br>`, etc.) ni lógica condicional en los archivos de datos.
3. **Entidades Locales en Plural**:
   - Las carpetas de entidades y archivos locales usan nombres en plural con la extensión `.data.json` (ejemplo: `src/data/categories/categories.data.json`).
4. **Relaciones Consistentes**:
   - Si una entidad depende de otra (por ejemplo, productos dentro de una categoría), deben incluir referencias consistentes por `id` o `slug` (ej. `categoryId: "calzado"`).

---

## 3. Plantillas de Datos

### A. Contenido de Página (`src/data/site-<pagina>-content.json`)

```json
{
  "es": {
    "brandName": "Mi Marca - Inicio",
    "meta": {
      "title": "Título SEO para la página",
      "description": "Descripción SEO optimizada para buscadores en español."
    },
    "hero": {
      "tag": "Novedad 2026",
      "title": "Transforma tu experiencia digital",
      "subtitle": "La plataforma más rápida y moderna diseñada para tu negocio.",
      "ctaText": "Comenzar Ahora",
      "ctaUrl": "/es/contacto"
    },
    "features": {
      "title": "Características Principales",
      "items": [
        {
          "icon": "speed",
          "title": "Velocidad Extrema",
          "description": "Optimizada para cargar en menos de un segundo en cualquier dispositivo."
        }
      ]
    }
  },
  "en": {
    "brandName": "My Brand - Home",
    "meta": {
      "title": "SEO Title for page",
      "description": "SEO optimized description for search engines in English."
    },
    "hero": {
      "tag": "New in 2026",
      "title": "Transform your digital experience",
      "subtitle": "The fastest and most modern platform built for your business.",
      "ctaText": "Get Started",
      "ctaUrl": "/en/contact"
    },
    "features": {
      "title": "Key Features",
      "items": [
        {
          "icon": "speed",
          "title": "Extreme Speed",
          "description": "Optimized to load in less than a second on any device."
        }
      ]
    }
  }
}
```

### B. Contenido Global (`src/data/site-global-content.json`)

```json
{
  "es": {
    "navbar": {
      "links": [
        { "name": "Inicio", "url": "/" },
        {
          "name": "Productos",
          "url": "/productos",
          "children": [
            { "name": "Calzado", "url": "/productos/calzado" },
            { "name": "Accesorios", "url": "/productos/accesorios" }
          ]
        },
        { "name": "Contacto", "url": "/contacto" }
      ],
      "cta": {
        "text": "Empezar",
        "url": "/registro"
      }
    },
    "footer": {
      "copyright": "© 2026 AutoUI. Todos los derechos reservados.",
      "links": [
        { "name": "Privacidad", "url": "/privacidad" },
        { "name": "Términos", "url": "/terminos" }
      ]
    }
  },
  "en": {
    "navbar": {
      "links": [
        { "name": "Home", "url": "/" },
        {
          "name": "Products",
          "url": "/products",
          "children": [
            { "name": "Footwear", "url": "/products/footwear" },
            { "name": "Accessories", "url": "/products/accessories" }
          ]
        },
        { "name": "Contact", "url": "/contact" }
      ],
      "cta": {
        "text": "Get Started",
        "url": "/register"
      }
    },
    "footer": {
      "copyright": "© 2026 AutoUI. All rights reserved.",
      "links": [
        { "name": "Privacy", "url": "/privacy" },
        { "name": "Terms", "url": "/terms" }
      ]
    }
  }
}
```

### C. Colección de Entidades Locales (`src/data/<modulo>/<modulo>.data.json`)

```json
{
  "categories": [
    {
      "id": "tecnologia",
      "slug": "tecnologia",
      "name": {
        "es": "Tecnología",
        "en": "Technology"
      },
      "description": {
        "es": "Gadgets y electrónica moderna",
        "en": "Modern gadgets and electronics"
      },
      "image": "/images/tecnologia/banner.png",
      "order": 1
    }
  ]
}
```

---

## 4. Checklist de Validación para el Coder

- [ ] ¿El archivo JSON es sintácticamente válido (sin comas finales ni errores)?
- [ ] ¿Están presentes tanto `es` como `en` con claves y jerarquía exactamente idénticas?
- [ ] ¿Las rutas de imágenes referencian la convención `/images/<categoria>/...` o `/images/home/...`?
- [ ] ¿Las rutas relativas no contienen hardcodeo de idiomas si van a ser procesadas por `useTranslations`?
