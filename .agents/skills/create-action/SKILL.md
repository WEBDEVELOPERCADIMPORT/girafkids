---
name: create-action
description: Creates or updates Astro Server Actions in src/actions/<modulo>/<accion>.action.ts and registers them in src/actions/index.ts, ensuring strong typing, data integrity, and separation of concerns.
---

# Create Action Skill

Esta skill define las reglas, estándares y patrones para crear y registrar **Server Actions** en **AutoUI** utilizando la API nativa de `astro:actions`.

---

## 1. Responsabilidad y Ubicación

Las Server Actions encapsulan toda la lógica de obtención, consulta o mutación de datos (desde `src/data/` o `src/db/`).

### Estructura de Directorios
```plaintext
src/actions/
├── index.ts                      # Registro central (export const server = { ... })
└── <modulo>/                     # Módulo por dominio (ej. categories/, products/, reviews/, contact/)
    └── <accion>.action.ts        # Definición de la acción individual (ej. getProducts.action.ts)
```

---

## 2. Reglas Inquebrantables de Actions

1. **Propósito Exclusivo de Datos**:
   - Una acción **JAMÁS** debe generar o devolver HTML, marcado JSX/Astro o componentes visuales.
   - Su único propósito es procesar parámetros, consultar fuentes de datos (`data/` o `db/`) y retornar objetos tipados.
2. **Tipado Estricto de Entrada y Salida**:
   - Cada acción debe tener un tipo o interfaz explícita para su respuesta:
     ```typescript
     Promise<{ message: string; data: T }>
     // o en caso de error/mutación controlada:
     Promise<{ message: string; data?: T; success?: boolean }>
     ```
   - Si recibe parámetros de entrada, deben validarse usando `z` de `astro:schema` o `zod`.
3. **Registro Centralizado**:
   - Toda acción creada en `src/actions/<modulo>/<accion>.action.ts` **DEBE** ser importada y exportada dentro del objeto `server` en `src/actions/index.ts`.
4. **Manejo de Errores Limpio**:
   - Usar `ActionError` de `astro:actions` cuando ocurra un fallo de negocio (ej. `BAD_REQUEST`, `NOT_FOUND`).

---

## 3. Plantillas de Código

### A. Acción de Consulta (`src/actions/<modulo>/get<Recurso>.action.ts`)

```typescript
// src/actions/products/getProductsByCategory.action.ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import productsData from '../../data/products/products.data.json';

export interface ProductItem {
  id: string;
  slug: string;
  categoryId: string;
  title: Record<string, string>;
  price: number;
  image: string;
}

export interface GetProductsResult {
  message: string;
  data: ProductItem[];
}

export const getProductsByCategory = defineAction({
  input: z.object({
    categorySlug: z.string().min(1, 'El slug de categoría es requerido'),
  }),
  handler: async ({ categorySlug }): Promise<GetProductsResult> => {
    const allProducts = (productsData.products || []) as ProductItem[];
    const filtered = allProducts.filter((p) => p.categoryId === categorySlug);

    if (filtered.length === 0) {
      // Opcional: retornar vacío o lanzar error según caso de negocio
      return {
        message: 'No se encontraron productos para esta categoría',
        data: [],
      };
    }

    return {
      message: 'Productos obtenidos con éxito',
      data: filtered,
    };
  },
});
```

### B. Acción de Mutación / Formulario (`src/actions/<modulo>/submit<Accion>.action.ts`)

```typescript
// src/actions/contact/submitContactForm.action.ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export interface SubmitContactResult {
  message: string;
  data: { success: boolean; id: string };
}

export const submitContactForm = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2, 'Nombre demasiado corto'),
    email: z.string().email('Correo electrónico inválido'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  }),
  handler: async (input): Promise<SubmitContactResult> => {
    try {
      // Lógica de procesamiento (ej. guardar en DB o enviar email)
      const submissionId = crypto.randomUUID();

      return {
        message: 'Formulario recibido correctamente',
        data: { success: true, id: submissionId },
      };
    } catch (error) {
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error al procesar el mensaje',
      });
    }
  },
});
```

### C. Registro Centralizado (`src/actions/index.ts`)

```typescript
// src/actions/index.ts
import { getProductsByCategory } from './products/getProductsByCategory.action';
import { submitContactForm } from './contact/submitContactForm.action';
import { getReviews } from './reviews/getReviews.action';

export const server = {
  // Reviews
  getReviews,

  // Products
  getProductsByCategory,

  // Contact
  submitContactForm,
};
```

---

## 4. Invocación desde Páginas Astro

En el frontmatter de las páginas (`src/pages/[lang]/...`), las acciones se consumen usando `Astro.callAction`:

```astro
---
import { actions } from 'astro:actions';

const { data: response, error } = await Astro.callAction(
  actions.getProductsByCategory,
  { categorySlug: 'calzado' }
);

if (error) {
  // Manejo de error o redirección
}

const products = response?.data ?? [];
---
```

---

## 5. Checklist de Validación para el Coder

- [ ] ¿La acción está en su carpeta correspondiente dentro de `src/actions/<modulo>/`?
- [ ] ¿Los tipos de entrada y salida están claramente definidos e importados/exportados?
- [ ] ¿La acción fue registrada en `src/actions/index.ts` dentro de `export const server = { ... }`?
- [ ] ¿La respuesta cumple el formato estándar `{ message: string, data: T }`?
- [ ] ¿No contiene ningún import de componentes visuales ni código HTML?
