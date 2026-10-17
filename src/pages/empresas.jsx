import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import EncontrarEmpresa from "../components/EncontrarEmpresa";
import Seo from "../components/Seo";
import { IconBars, IconClose } from "../components/Icons";
import { getCardListings, getCategorias } from "@/lib/listings";
import { breadcrumbJsonLd } from "@/lib/site";

function Empresas({ empresas, categorias }) {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 640);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCategoriaClick = (categoria) => {
        setCategoriaSelecionada(categoriaSelecionada === categoria ? '' : categoria);
    };

    const filteredData = useMemo(() => {
        if (!categoriaSelecionada) return empresas;
        return empresas.filter((empresa) => empresa.categoria === categoriaSelecionada);
    }, [empresas, categoriaSelecionada]);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <div className="flex flex-col min-h-screen w-full">
            <Seo
                title="Empresas à venda"
                path="/empresas"
                description="Empresas à venda no Paraná: padarias, restaurantes, lojas, indústrias e outros negócios em Curitiba, Ponta Grossa e região, com intermediação da MGA Corretora."
                jsonLd={breadcrumbJsonLd([{ name: 'Início', path: '/' }, { name: 'Empresas', path: '/empresas' }])}
            />
            <Header />
            <div className="flex w-full justify-center">
                <div className="sm:w-10/12 w-full">
                    <EncontrarEmpresa tipoMostrado={"Empresas"}/>
                </div>
            </div>
            <main className="flex flex-col sm:flex-row justify-center flex-grow items-center md:items-start w-full">
                <nav aria-label="Categorias" className="w-11/12 md:w-fit p-4 sm:m-12 sm:mt-16 mt-4 shadow-md rounded-md items-start flex flex-row flex-wrap sm:flex-col h-full">
                    <button className="text-3xl font-bold sm:mb-8 text-red-800 w-full flex items-center self-start md:cursor-default justify-evenly md:justify-center"
                        onClick={handleMenuClick}
                        aria-expanded={!isMobile || menuOpen}>
                        Categorias
                        {(isMobile && menuOpen) && IconClose}
                        {(isMobile && !menuOpen) && IconBars}
                    </button>
                    <div className={`${isMobile && !menuOpen ? 'hidden' : 'flex flex-wrap md:flex-col'}`}>
                        {categorias.map((categoria) => (
                            <div key={categoria.categoria} className="mb-2">
                                <button
                                    onClick={() => handleCategoriaClick(categoria.categoria)}
                                    aria-pressed={categoriaSelecionada === categoria.categoria}
                                    className={`p-2 m-1 rounded-sm shadow-md ${categoriaSelecionada === categoria.categoria ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                                >
                                    {categoria.categoria}
                                </button>
                            </div>
                        ))}
                    </div>
                </nav>
                <div className="flex flex-grow w-full">
                    <div className="sm:w-11/12 w-full md:p-4">
                        <Cards tipoMostrado="Empresas" dataToShow={filteredData} titleTag="h1" />
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
        const [empresas, categorias] = await Promise.all([getCardListings('Empresas'), getCategorias()]);
        res.setHeader('Cache-Control', CACHE_OK);
        return { props: { empresas, categorias } };
    } catch (error) {
        console.error('Error loading empresas:', error.message);
        res.setHeader('Cache-Control', 'no-store');
        return { props: { empresas: [], categorias: [] } };
    }
}

export default Empresas;
