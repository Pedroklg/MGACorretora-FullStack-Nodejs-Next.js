import '../styles/globals.css';
import EncontrarEmpresa from '../components/EncontrarEmpresa';
import Cards from '../components/Cards';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <div className="md:m-10 relative">
        <EncontrarEmpresa />
        <Banner />
        <Cards tipoMostrado="ambos"/>
      </div>
      <Footer />
    </>
  );
}
