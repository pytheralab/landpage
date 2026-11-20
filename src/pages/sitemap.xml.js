// Sitemap tĩnh: trang chủ 3 ngôn ngữ (kèm hreflang) và các trang pháp lý
import site from '../content/site.vi.json';

export function GET() {
  const base = site.site_url;
  const langs = [['vi', '/'], ['en', '/en/'], ['ja', '/ja/']];
  const alt = langs.map(([l, p]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${base}${p}"/>`).join('');
  const urls = langs.map(([, p]) => `<url><loc>${base}${p}</loc>${alt}</url>`)
    .concat(['/privacy.html', '/terms.html'].map((p) => `<url><loc>${base}${p}</loc></url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
