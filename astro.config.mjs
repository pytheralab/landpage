import { defineConfig } from 'astro/config';

// Site tĩnh, mỗi ngôn ngữ một trang: / (vi), /en/, /ja/
export default defineConfig({
  site: 'https://www.pythera.ai',
  build: { format: 'directory' },
});
