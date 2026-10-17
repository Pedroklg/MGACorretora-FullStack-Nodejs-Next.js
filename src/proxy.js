import { NextResponse } from 'next/server';

// Endereços antigos (com maiúsculas) -> novos endereços em minúsculas, com redirecionamento permanente
const LEGACY_PATHS = {
  '/Empresas': '/empresas',
  '/Imoveis': '/imoveis',
  '/Contato': '/contato',
  '/Sobre': '/sobre',
  '/QueroVender': '/quero-vender',
  '/SejaParceiro': '/seja-parceiro',
  '/PoliticasDePrivacidade': '/politica-de-privacidade',
  '/Search': '/busca',
};

export function proxy(req) {
  const destination = LEGACY_PATHS[req.nextUrl.pathname];
  if (!destination) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    '/Empresas',
    '/Imoveis',
    '/Contato',
    '/Sobre',
    '/QueroVender',
    '/SejaParceiro',
    '/PoliticasDePrivacidade',
    '/Search',
  ],
};
