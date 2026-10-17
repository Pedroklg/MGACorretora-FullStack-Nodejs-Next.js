import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import { useState, useMemo } from "react";
import EncontrarEmpresa from "../components/EncontrarEmpresa";
import Seo from "../components/Seo";
import { getCardListings } from "@/lib/listings";
import { breadcrumbJsonLd } from "@/lib/site";

function Imoveis({ imoveis }) {
    const [modalidade, setModalidade] = useState('');

    const handleModalidadeClick = (newModalidade) => {
        setModalidade(modalidade === newModalidade ? '' : newModalidade);
    };

    const filteredData = useMemo(() => {
        if (!modalidade) return imoveis;
        return imoveis.filter((imovel) => imovel.aluguel === (modalidade === 'aluguel'));
    }, [imoveis, modalidade]);

    return (
        <div className="flex flex-col min-h-screen">
            <Seo
                title="Imóveis à venda e para alugar"
                path="/imoveis"
                description="Imóveis comerciais e residenciais à venda e para locação em Curitiba, Ponta Grossa e região. Encontre o imóvel ideal com a MGA Corretora."
                jsonLd={breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'Imóveis', path: '/imoveis' }])}
            />
            <Header />
            <div className="flex w-full justify-center">
                <div className="sm:w-10/12 w-full">
                    <EncontrarEmpresa tipoMostrado={"Imoveis"}/>
                </div>
            </div>
            <main className="flex flex-col sm:flex-row justify-center flex-grow">
                <aside className="w-fit p-4 sm:m-12 sm:mt-16 mt-8 shadow-md rounded-md items-start flex flex-row flex-wrap sm:flex-col h-full m-5">
                    <h2 className="text-3xl font-bold sm:mb-8 text-red-800 w-full">Finalidade</h2>
                    <div className="mb-2 flex sm:flex-col">
                        <button
                            onClick={() => handleModalidadeClick('aluguel')}
                            aria-pressed={modalidade === 'aluguel'}
                            className={`p-2 m-3 rounded-sm shadow-md ${modalidade === 'aluguel' ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                        >
                            Locação
                        </button>
                        <button
                            onClick={() => handleModalidadeClick('venda')}
                            aria-pressed={modalidade === 'venda'}
                            className={`p-2 m-3 rounded-sm shadow-md ${modalidade === 'venda' ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                        >
                            Venda
                        </button>
                    </div>
                </aside>
                <div className="flex flex-grow">
                    <div className="sm:w-11/12 w-full p-4">
                        <Cards tipoMostrado="Imoveis" dataToShow={filteredData} titleTag="h1" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Com o banco fora do ar a página sai vazia: nesse caso não pode ficar em cache
const CACHE_OK = 'public, s-maxage=60, stale-while-revalidate=300';

export async function getServerSideProps({ res }) {
    try {
        const imoveis = await getCardListings('Imoveis');
        res.setHeader('Cache-Control', CACHE_OK);
        return { props: { imoveis } };
    } catch (error) {
        console.error('Error loading imoveis:', error.message);
        res.setHeader('Cache-Control', 'no-store');
        return { props: { imoveis: [] } };
    }
}

export default Imoveis;
