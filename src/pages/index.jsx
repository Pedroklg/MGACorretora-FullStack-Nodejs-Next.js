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
        <div className="w-full md:w-10/12 mt-4 md:mt-8">
          <Banner />
          <EncontrarEmpresa />
        </div>
        <Cards tipoMostrado="ambos" />
      </div>
      <Footer />
    </>
  );
}
