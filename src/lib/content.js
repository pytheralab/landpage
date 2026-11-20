// Nạp nội dung do CMS quản lý. Trường không dịch (email, địa chỉ...) chỉ cần có trong bản tiếng Việt.
import homeVi from '../content/home.vi.json';
import homeEn from '../content/home.en.json';
import homeJa from '../content/home.ja.json';
import siteVi from '../content/site.vi.json';
import siteEn from '../content/site.en.json';
import siteJa from '../content/site.ja.json';
import ILL from '../data/illustrations.json';

export const LOCALES = ['vi', 'en', 'ja'];
export const LOCALE_PATH = { vi: '/', en: '/en/', ja: '/ja/' };
export const OG_LOCALE = { vi: 'vi_VN', en: 'en_US', ja: 'ja_JP' };
export const LANG_NAME = { vi: 'Tiếng Việt', en: 'English', ja: '日本語' };

const homes = { vi: homeVi, en: homeEn, ja: homeJa };
const sites = { vi: siteVi, en: siteEn, ja: siteJa };

export function getContent(locale) {
  return { home: homes[locale], site: { ...siteVi, ...sites[locale] } };
}

// Hình minh họa SVG; suffix đổi id để chèn cùng một hình hai lần mà không trùng id
export function illustration(name, suffix = '') {
  let svg = ILL[name] || '';
  if (suffix) {
    svg = svg.replace(/id="([^"]+)"/g, `id="$1${suffix}"`).replace(/url\(#([^)]+)\)/g, `url(#$1${suffix})`);
  }
  return svg;
}
