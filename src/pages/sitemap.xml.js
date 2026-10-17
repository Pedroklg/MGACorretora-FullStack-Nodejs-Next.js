import { getIndexableListings } from '@/lib/listings';
import { absoluteUrl, listingPath } from '@/lib/site';

const STATIC_PAGES = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/empresas', changefreq: 'daily', priority: '0.9' },
    { path: '/imoveis', changefreq: 'daily', priority: '0.9' },
    { path: '/quero-vender', changefreq: 'monthly', priority: '0.7' },
    { path: '/contato', changefreq: 'monthly', priority: '0.6' },
    { path: '/sobre', changefreq: 'monthly', priority: '0.5' },
    { path: '/seja-parceiro', changefreq: 'monthly', priority: '0.5' },
    { path: '/politica-de-privacidade', changefreq: 'yearly', priority: '0.2' },
];

const escapeXml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

export const buildSitemap = (listings) => {
    const urls = [
        ...STATIC_PAGES.map((page) => ({ loc: absoluteUrl(page.path), changefreq: page.changefreq, priority: page.priority })),
        ...listings.map((item) => ({
            loc: absoluteUrl(listingPath(item)),
            lastmod: toDate(item.data_registro),
            changefreq: 'weekly',
            priority: '0.8',
        })),
    ];

    const body = urls.map((url) => [
        '  <url>',
        `    <loc>${escapeXml(url.loc)}</loc>`,
        url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : null,
        `    <changefreq>${url.changefreq}</changefreq>`,
        `    <priority>${url.priority}</priority>`,
        '  </url>',
    ].filter(Boolean).join('\n')).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
};

export async function getServerSideProps({ res }) {
    let listings = [];
    try {
        listings = await getIndexableListings();
    } catch (error) {
        console.error('Error building sitemap:', error.message);
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=900');
    res.end(buildSitemap(listings));
    return { props: {} };
}

export default function Sitemap() {
    return null;
}
