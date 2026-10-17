import Head from 'next/head';
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/site';

const DEFAULT_IMAGE = '/Banner_1.png';

// Escapa "<" para que o JSON-LD não feche a tag <script> antes da hora
const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export default function Seo({
    title,
    description = DEFAULT_DESCRIPTION,
    path,
    image = DEFAULT_IMAGE,
    imageAlt,
    type = 'website',
    noindex = false,
    jsonLd,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Compra e venda de empresas e imóveis no Paraná`;
    const canonical = path ? absoluteUrl(path) : null;
    const imageUrl = image ? absoluteUrl(image) : null;
    const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} key="description" />
            <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} key="robots" />
            {canonical && !noindex && <link rel="canonical" href={canonical} key="canonical" />}

            <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
            <meta property="og:locale" content="pt_BR" key="og:locale" />
            <meta property="og:type" content={type} key="og:type" />
            <meta property="og:title" content={fullTitle} key="og:title" />
            <meta property="og:description" content={description} key="og:description" />
            {canonical && <meta property="og:url" content={canonical} key="og:url" />}
            {imageUrl && <meta property="og:image" content={imageUrl} key="og:image" />}
            {imageUrl && <meta property="og:image:alt" content={imageAlt || fullTitle} key="og:image:alt" />}

            <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} key="twitter:card" />
            <meta name="twitter:title" content={fullTitle} key="twitter:title" />
            <meta name="twitter:description" content={description} key="twitter:description" />
            {imageUrl && <meta name="twitter:image" content={imageUrl} key="twitter:image" />}

            {jsonLdItems.map((item, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: toJsonLd(item) }}
                />
            ))}
        </Head>
    );
}
