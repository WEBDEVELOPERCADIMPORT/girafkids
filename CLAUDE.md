# CLAUDE.md — Guía Maestra de Contexto y Orquestación de Agentes (AutoUI Starter Kit)

> **INSTRUCCIÓN CRÍTICA DE ENTRADA**: Antes de responder con código o modificar cualquier archivo en este repositorio, **DEBES** seguir las reglas, agentes, skills y flujo de trabajo definidos en este documento, en [`ARCHITECTURE.md`](file:///Applications/landing-starter-kit/ARCHITECTURE.md) y en [`AGENTS.md`](file:///Applications/landing-starter-kit/AGENTS.md).

---

## 1. Protocolo Obligatorio Antes de Codear

Cada vez que recibas un requerimiento del usuario:
1. **Revisa la Memoria del Proyecto**: Lee [`.agents/MEMORY.md`](file:///Applications/landing-starter-kit/.agents/MEMORY.md) para conocer el estado actual de `src/`, las páginas existentes, los diccionarios de contenido, las Server Actions y la configuración de Cloudflare/Tailwind.
2. **Consulta la Arquitectura Base**: Revisa [`ARCHITECTURE.md`](file:///Applications/landing-starter-kit/ARCHITECTURE.md) para alinearte con las convenciones de AutoUI (`site_category_products`, convenciones de imágenes en `public/images/`, etc.).
3. **Identifica los Agentes en `.agents/agents/`**:
   - [`manager`](file:///Applications/landing-starter-kit/.agents/agents/manager/SKILL.md): Analiza el requerimiento, solicita insumos visuales de Figma si aplica, estructura las tareas atómicas (`#Task-01`, `#Task-02`, ...) y delega al `coder` y al `tester`.
   - [`coder`](file:///Applications/landing-starter-kit/.agents/agents/coder/SKILL.md): Ejecuta una única tarea a la vez (`triage` o `implement`) siguiendo estrictamente las skills asignadas.
   - [`tester`](file:///Applications/landing-starter-kit/.agents/agents/tester/SKILL.md): Audita el código contra las restricciones arquitectónicas de AutoUI, verifica tipos y build, y aprueba (`VERIFIED`) o solicita rework (`REWORK_REQUIRED`).
4. **Consulta las Skills Técnicas en `.agents/skills/`**:
   - [`create-data`](file:///Applications/landing-starter-kit/.agents/skills/create-data/SKILL.md): Contenidos i18n (`site-<pagina>-content.json`) y datos locales (`.data.json`).
   - [`create-action`](file:///Applications/landing-starter-kit/.agents/skills/create-action/SKILL.md): Server Actions con `astro:actions` y registro centralizado en `src/actions/index.ts`.
   - [`create-component`](file:///Applications/landing-starter-kit/.agents/skills/create-component/SKILL.md): Componentes y secciones de presentación pura con Tailwind CSS v4 y eventos `astro:page-load`.
   - [`create-page`](file:///Applications/landing-starter-kit/.agents/skills/create-page/SKILL.md): Rutas dinámicas `src/pages/[lang]/...`, redirecciones a `/404`, `Astro.callAction` y Layout SEO.

---

## 2. Ciclo de Implementación (`Manager` ➔ `Coder` ➔ `Tester` ➔ `Memory`)

1. **Fase 1 — Planificación (`manager`)**:
   - Analiza el requerimiento, consulta `.agents/MEMORY.md` y solicita referencias de diseño (Figma) si es una nueva página o estructura.
   - Desglosa la entrega en el orden coordinado: `Media` ➔ `Data` ➔ `Actions` ➔ `Components` ➔ `Pages`.
   - Genera briefs con ID (#Task-XX), archivos objetivo, skills requeridas y criterios de aceptación.
2. **Fase 2 — Desarrollo (`coder`)**:
   - Lee las skills indicadas en el brief.
   - Implementa los archivos respetando presentación pura, tipado estricto y simetría de idiomas.
   - Realiza comprobaciones locales y entrega evidencia en su reporte.
3. **Fase 3 — Auditoría y Verificación (`tester`)**:
   - Audita cumplimiento arquitectónico (cero lógica de negocio en componentes, simetría en JSONs `es`/`en`, scripts con `astro:page-load`, acciones en `index.ts`).
   - Si detecta inconsistencias, envía un reporte de `REWORK_REQUIRED` al `coder`.
   - Si todo es conforme, emite dictamen `VERIFIED`.
4. **Fase 4 — Actualización de Memoria (`manager`)**:
   - El `manager` registra los nuevos componentes, acciones, páginas y cambios en [`.agents/MEMORY.md`](file:///Applications/landing-starter-kit/.agents/MEMORY.md).

---

## 3. Comandos Principales del Proyecto

- **Desarrollo**:
  ```bash
  npm run dev
  ```
- **Compilación para Producción (Cloudflare SSR)**:
  ```bash
  npm run build
  ```
- **Previsualización de Build**:
  ```bash
  npm run preview
  ```
- **Generación de Tipos de Wrangler (Cloudflare)**:
  ```bash
  npm run generate-types
  ```

---

## 4. Restricciones Arquitectónicas Clave (AutoUI)

- **Componentes Desacoplados**: `src/components/` jamás debe ejecutar queries a base de datos ni mutaciones directas.
- **Acciones Centralizadas y Tipadas**: Todas las acciones deben exportarse en `src/actions/index.ts` bajo `export const server = { ... }` y retornar `{ message: string, data: T }`.
- **Espejado Multilenguaje**: Todo contenido en `src/data/` debe tener paridad estricta entre `es` y `en`.
- **Rutas bajo `[lang]`**: Toda página de contenido debe validar el idioma recibido en `Astro.params.lang` y redireccionar a `/404` si no es válido.
- **ClientRouter**: Cualquier script de cliente interactivo debe registrar su inicialización también en `document.addEventListener('astro:page-load', ...)`.
- **Organización de Imágenes**: Seguir la convención `public/images/<categoria>/...` o `public/images/home/...`.
