import { SITE_URL } from '@/lib/site';

// Robôs de busca e de assistentes de IA (que citam e linkam o site) liberados.
// Os de treinamento de modelos também, já que o objetivo é ser encontrado; para bloqueá-los,
// troque "Allow: /" por "Disallow: /" no grupo correspondente.
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

// /busca fica fora daqui de propósito: ela tem "noindex", e o robô precisa acessá-la para ler isso
const PRIVATE_PATHS = ['/admin', '/api/'];

export const buildRobotsTxt = () => {
    const privateRules = PRIVATE_PATHS.map((path) => `Disallow: ${path}`).join('\n');
    const group = (agents) => `${agents.map((agent) => `User-agent: ${agent}`).join('\n')}\nAllow: /\n${privateRules}`;

    return [
        `User-agent: *\nAllow: /\n${privateRules}`,
        group(AI_SEARCH_BOTS),
        group(AI_TRAINING_BOTS),
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        '',
    ].join('\n\n');
};

export async function getServerSideProps({ res }) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(buildRobotsTxt());
    return { props: {} };
}

export default function Robots() {
    return null;
}
