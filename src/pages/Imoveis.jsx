import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";

function Imoveis() {
    return (
        <div>
            <title>Imóveis</title>
            <Header />
            <body className="flex flex-grow">
                <Cards tipoMostrado="Imoveis" />
            </body>
            <Footer />
        </div>
    )
}

export default Imoveis;