/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly BACKEND_API_URL: string;
  readonly BACKEND_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
