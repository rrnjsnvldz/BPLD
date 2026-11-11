/**
 * Architectural boundary tests.
 * Verify module isolation rules from ADR-002 are not violated.
 * Run with: npx vitest run src/__tests__/architecture.test.ts
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

const ROOT = join(process.cwd());
const MODULES_DIR = join(ROOT, 'src', 'lib', 'modules');

const MODULE_NAMES = [
  'customers', 'scheduling', 'service-orders', 'inventory',
  'billing', 'payroll', 'finance', 'reminders',
  'follow-up', 'reporting', 'administration',
];

function getAllFiles(dir: string, ext: string[] = ['.ts', '.tsx']): string[] {
  if (!existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...getAllFiles(full, ext));
    else if (ext.some((e) => entry.name.endsWith(e))) result.push(full);
  }
  return result;
}

describe('Module boundary rules (ADR-002)', () => {
  it('each module has a contracts.ts file', () => {
    for (const mod of MODULE_NAMES) {
      const contractPath = join(MODULES_DIR, mod, 'contracts.ts');
      expect(existsSync(contractPath), `Missing contracts.ts for module ${mod}`).toBe(true);
    }
  });

  it('no module imports another module\'s internals (domain/, data/, types/)', () => {
    const violations: string[] = [];
    for (const modA of MODULE_NAMES) {
      const modDir = join(MODULES_DIR, modA);
      const files = getAllFiles(modDir);
      for (const file of files) {
        if (file.endsWith('contracts.ts')) continue;
        const content = readFileSync(file, 'utf-8');
        const importLines = content.split('\n').filter((l) => l.trim().startsWith('import'));
        for (const line of importLines) {
          for (const modB of MODULE_NAMES) {
            if (modA === modB) continue;
            if (line.includes(`modules/${modB}/domain`) ||
                line.includes(`modules/${modB}/data`) ||
                line.includes(`modules/${modB}/types`)) {
              violations.push(`${relative(ROOT, file)}: ${line.trim()}`);
            }
          }
        }
      }
    }
    expect(violations, `Cross-module internal imports found:\n${violations.join('\n')}`).toHaveLength(0);
  });

  it('migration files follow 00NNN_*.sql naming', () => {
    const migrationsDir = join(ROOT, 'supabase', 'migrations');
    if (!existsSync(migrationsDir)) return;
    const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    for (const f of files) {
      expect(f, `Migration file ${f} does not match 00NNN_*.sql pattern`)
        .toMatch(/^\d{5}_[a-z0-9_]+\.sql$/);
    }
  });
});
