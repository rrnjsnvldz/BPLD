import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Module boundary enforcement (ADR-002)
  // Modules may not import each other's internals — only contracts.ts is public.
  {
    files: ['src/lib/modules/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/modules/*/domain/*', '@/lib/modules/*/data/*', '@/lib/modules/*/types/*'],
              message:
                'Cross-module internal imports are forbidden. Import from the module\'s contracts.ts only. See ADR-002.',
            },
          ],
        },
      ],
    },
  },
  // Platform files may not import from module internals (only contracts.ts)
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/modules/*/domain/*', '@/lib/modules/*/data/*'],
              message:
                'Import from the module\'s contracts.ts, not its internals. See ADR-002.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
