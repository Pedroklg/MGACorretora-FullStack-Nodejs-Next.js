import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";

function Empresas () {
    return (
        <div>
            <Header />
            <body className="flex flex-grow">
            <Cards tipoMostrado="Empresas"/>
            </body>
            <Footer />
        </div>
    )
}

export default Empresas;