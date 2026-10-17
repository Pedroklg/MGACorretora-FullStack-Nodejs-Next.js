// Defina NEXT_PUBLIC_SITE_URL com o domínio definitivo (ex.: https://www.mgacorretora.com.br).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mgacorretora.com.br').replace(/\/+$/, '');

export const SITE_NAME = 'MGA Corretora';

export const DEFAULT_DESCRIPTION = 'MGA Corretora de empresas e imóveis no Paraná. Intermediação na compra e venda de empresas e imóveis em Curitiba, Ponta Grossa, Guarapuava e região.';

export const ORGANIZATION = {
    name: SITE_NAME,
    legalId: 'CRECI J5087',
    email: 'contato@mgacorretora.com.br',
    logo: '/logo.png',
    areaServed: ['Curitiba', 'Ponta Grossa', 'Guarapuava', 'Paraná'],
    contacts: [
        { city: 'Curitiba', telephone: '+55-41-99540-0788' },
        { city: 'Ponta Grossa', telephone: '+55-42-99909-4741' },
    ],
};

export const absoluteUrl = (path = '/') => {
    if (/^https?:\/\//.test(path)) return path;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const slugify = (text) => String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

export const listingSlug = (item) => {
    const slug = slugify(item.titulo);
    return slug ? `${item.id}-${slug}` : String(item.id);
};

export const listingPath = (item) => `/anuncio/${listingSlug(item)}`;

export const organizationJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    url: SITE_URL,
    logo: absoluteUrl(ORGANIZATION.logo),
    image: absoluteUrl(ORGANIZATION.logo),
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.contacts[0].telephone,
    description: DEFAULT_DESCRIPTION,
    identifier: ORGANIZATION.legalId,
    areaServed: ORGANIZATION.areaServed.map((name) => ({ '@type': 'Place', name })),
    address: { '@type': 'PostalAddress', addressRegion: 'PR', addressCountry: 'BR' },
    contactPoint: ORGANIZATION.contacts.map((contact) => ({
        '@type': 'ContactPoint',
        telephone: contact.telephone,
        contactType: 'sales',
        areaServed: contact.city,
        availableLanguage: 'Portuguese',
    })),
});

export const websiteJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/busca?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
    },
});

export const breadcrumbJsonLd = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
    })),
});
