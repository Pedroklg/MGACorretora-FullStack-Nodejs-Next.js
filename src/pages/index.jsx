import EncontrarEmpresa from '../components/EncontrarEmpresa';
import Cards from '../components/Cards';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <title>MGA Corretora</title>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col xl:relative w-full">
          <Banner />
          <div className="flex xl:absolute xl:bottom-0 xl:left-1/2 xl:transform xl:-translate-x-1/2 xl:z-10 xl:mb-4 xl:w-10/12 xl:opacity-90">
            <EncontrarEmpresa />
          </div>
        </div>
        <div className="xl:w-10/12 xl:mt-8 w-full">
          <Cards tipoMostrado="ambos" />
        </div>
      </div>
      <Footer />
    </>
  );
}
