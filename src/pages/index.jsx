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
        <div className="md:w-10/12 md:mt-8">
          <EncontrarEmpresa />
          <Banner />
        </div>
        <Cards tipoMostrado="ambos" />
      </div>
      <Footer />
    </>
  );
}
