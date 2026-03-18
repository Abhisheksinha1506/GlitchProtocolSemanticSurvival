import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Ad blockers block any URL containing "fingerprint" in it.
// This transform hook rewrites lucide-react's dynamic icon import map
// so the fingerprint entry is inlined and never requested as a URL.
function stubBlockedIcons(): Plugin {
  return {
    name: 'stub-blocked-icons',
    transform(code, id) {
      if (id.includes('lucide-react') && code.includes('fingerprint')) {
        return {
          code: code.replace(
            /"fingerprint":\s*\(\)\s*=>\s*import\(['"][^'"]+['"]\)/g,
            '"fingerprint": () => Promise.resolve({ Fingerprint: () => null, default: () => null })'
          ),
          map: null,
        };
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), stubBlockedIcons()],
});
