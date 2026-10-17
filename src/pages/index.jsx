import EncontrarEmpresa from '../components/EncontrarEmpresa';
import Cards from '../components/Cards';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { getCardListings } from '@/lib/listings';
import { organizationJsonLd, websiteJsonLd } from '@/lib/site';

export default function Home({ listings }) {
  return (
    <>
      <Seo
        path="/"
        description="MGA Corretora: intermediação na compra e venda de empresas e imóveis em Curitiba, Ponta Grossa, Guarapuava e todo o Paraná."
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <Header />
      <main className="w-full flex flex-col items-center">
        <h1 className="sr-only">MGA Corretora: compra e venda de empresas e imóveis no Paraná</h1>
        <div className="flex flex-col md:relative w-full items-center">
          <Banner />
          <div className="flex xl:absolute xl:bottom-0 xl:left-1/2 xl:transform xl:-translate-x-1/2 xl:z-10 xl:mb-2 lg:w-10/12 xl:opacity-90">
            <EncontrarEmpresa />
          </div>
        </div>
        <div className="xl:w-10/12 w-full">
          <Cards tipoMostrado="ambos" dataToShow={listings ?? undefined} />
        </div>
      </main>
      <Footer />
    </>
  );
}

// Com o banco fora do ar a página sai vazia: nesse caso não pode ficar em cache
const CACHE_OK = 'public, s-maxage=60, stale-while-revalidate=300';

export async function getServerSideProps({ res }) {
  try {
    const listings = await getCardListings('ambos');
    res.setHeader('Cache-Control', CACHE_OK);
    return { props: { listings } };
  } catch (error) {
    console.error('Error loading home listings:', error.message);
    res.setHeader('Cache-Control', 'no-store');
    // Sem banco, a página ainda abre e os cards tentam carregar no navegador
    return { props: { listings: null } };
  }
}
