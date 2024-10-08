import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import SkeletonLoader from "../components/animations/SkeletonLoader";
import EncontrarEmpresa from "../components/EncontrarEmpresa";
import { IconBars, IconClose } from "../components/Icons";
import Head from "next/head";

function Empresas() {
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [dataToShow, setDataToShow] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const FilteredData = (dataToShow, categoria) => {
        if (!categoria) return dataToShow;

        return dataToShow.filter((empresa) => empresa.categoria === categoria);
    };

    useEffect(() => {
        fetchCategorias();
        fetchEmpresas();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await fetch('/api/categorias');
            if (!response.ok) {
                throw new Error('Failed to fetch categorias');
            }
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error('Error fetching categorias:', error);
        }
    };

    const fetchEmpresas = async () => {
        try {
            const response = await fetch('/api/empresas');
            if (!response.ok) {
                throw new Error('Failed to fetch empresas');
            }
            const data = await response.json();
            setDataToShow(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching empresas:', error);
            setLoading(false);
        }
    };

    const handleCategoriaClick = (categoria) => {
        setCategoriaSelecionada(categoria);
    };

    const filteredData = FilteredData(dataToShow, categoriaSelecionada);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <div className="flex flex-col min-h-screen w-full">
            <Head>
                <title>Empresas - MGA Corretora</title>
                <meta name="description" content="Explore as empresas disponíveis para venda ou parceria na MGA Corretora. Encontre a oportunidade de negócio ideal para você." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <div className="flex w-full justify-center">
                <div className="sm:w-10/12 w-full">
                    <EncontrarEmpresa tipoMostrado={"Empresas"}/>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center flex-grow items-center md:items-start w-full">
                <nav className="w-11/12 md:w-fit p-4 sm:m-12 sm:mt-16 mt-4 shadow-md rounded-md items-start flex flex-row flex-wrap sm:flex-col h-full">
                    <button className="text-3xl font-bold sm:mb-8 text-red-800 w-full flex items-center self-start md:cursor-default justify-evenly md:justify-center"
                        onClick={handleMenuClick}>
                        Categorias
                        {(isMobile && menuOpen) && IconClose}
                        {(isMobile && !menuOpen) && IconBars}
                    </button>
                    <div className={`${isMobile && !menuOpen ? 'hidden' : 'flex flex-wrap md:flex-col'}`}>
                        {categorias.map((categoria) => (
                            <div key={categoria.categoria} className="mb-2">
                                <button
                                    onClick={() => handleCategoriaClick(categoria.categoria)}
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
                        {loading ? (
                            <SkeletonLoader />
                        ) : (
                            <Cards tipoMostrado="Empresas" dataToShow={filteredData} />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Empresas;