import { getIndexableListings } from '@/lib/listings';
import toBrMoney from '@/lib/toBrMoney';
import { absoluteUrl, DEFAULT_DESCRIPTION, listingPath, ORGANIZATION, SITE_NAME } from '@/lib/site';

// Resumo do site em Markdown para assistentes de IA (padrão llms.txt: https://llmstxt.org)
const MAX_LISTINGS = 200;

const cleanLine = (value) => String(value ?? '').replace(/\s+/g, ' ').replace(/[[\]]/g, '').trim();

const describeListing = (item) => {
    const tipo = item.tipo === 'Empresa'
        ? `Empresa${item.categoria ? ` (${cleanLine(item.categoria)})` : ''}`
        : `Imóvel para ${item.aluguel ? 'locação' : 'venda'}`;
    const local = [item.cidade, item.estado].filter(Boolean).map(cleanLine).join('/');
    let price = '';
    try {
        price = item.valor_pretendido ? ` - ${toBrMoney(item.valor_pretendido)}` : '';
    } catch {
        price = '';
    }
    return `- [${cleanLine(item.titulo)}](${absoluteUrl(listingPath(item))}): ${tipo}${local ? ` em ${local}` : ''}${price}`;
};

export const buildLlmsTxt = (listings) => {
    const contacts = ORGANIZATION.contacts.map((contact) => `${contact.city}: ${contact.telephone}`).join('; ');
    const shown = listings.slice(0, MAX_LISTINGS);

    return [
        `# ${SITE_NAME}`,
        '',
        `> ${DEFAULT_DESCRIPTION}`,
        '',
        `${SITE_NAME} (${ORGANIZATION.legalId}) é uma corretora do Paraná especializada na intermediação de compra e venda de empresas e imóveis, administração de aluguéis, formação de carteira de investidores e consultoria empresarial. Atende ${ORGANIZATION.areaServed.join(', ')}.`,
        '',
        `Contato: ${ORGANIZATION.email}; ${contacts}. Os valores dos anúncios são informados pelos proprietários; detalhes e visitas são tratados com os corretores da MGA.`,
        '',
        '## Páginas principais',
        '',
        `- [Empresas à venda](${absoluteUrl('/empresas')}): todas as empresas anunciadas, com filtro por categoria`,
        `- [Imóveis](${absoluteUrl('/imoveis')}): imóveis comerciais e residenciais para venda e locação`,
        `- [Quero vender](${absoluteUrl('/quero-vender')}): formulário para cadastrar uma empresa ou imóvel para venda`,
        `- [Contato](${absoluteUrl('/contato')}): telefones, e-mail e formulário de contato`,
        `- [Sobre a MGA](${absoluteUrl('/sobre')}): missão, visão, valores e serviços`,
        '',
        '## Anúncios',
        '',
        ...(shown.length ? shown.map(describeListing) : ['- Nenhum anúncio disponível no momento.']),
        ...(listings.length > shown.length ? ['', `Lista completa no [sitemap](${absoluteUrl('/sitemap.xml')}).`] : []),
        '',
        '## Opcional',
        '',
        `- [Seja parceiro](${absoluteUrl('/seja-parceiro')})`,
        `- [Política de privacidade](${absoluteUrl('/politica-de-privacidade')})`,
        '',
    ].join('\n');
};

export async function getServerSideProps({ res }) {
    let listings = [];
    try {
        listings = await getIndexableListings();
    } catch (error) {
        console.error('Error building llms.txt:', error.message);
    }

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=900');
    res.end(buildLlmsTxt(listings));
    return { props: {} };
}

export default function LlmsTxt() {
    return null;
}
