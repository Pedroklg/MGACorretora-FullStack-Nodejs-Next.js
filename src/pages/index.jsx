import EncontrarEmpresa from '../components/EncontrarEmpresa';
import Cards from '../components/Cards';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>MGA Corretora</title>
        <meta name="description" content="Bem Vinda a MGA Corretora de empresas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col md:relative w-full items-center">
          <Banner />
          <div className="flex xl:absolute xl:bottom-0 xl:left-1/2 xl:transform xl:-translate-x-1/2 xl:z-10 xl:mb-2 lg:w-10/12 xl:opacity-90">
            <EncontrarEmpresa />
          </div>
        </div>
        <div className="xl:w-10/12 w-full">
          <Cards tipoMostrado="ambos" />
        </div>
      </div>
      <Footer />
    </>
  );
}
