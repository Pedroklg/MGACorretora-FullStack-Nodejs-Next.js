import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import SkeletonLoader from "../components/animations/SkeletonLoader"; // Import the SkeletonLoader component
import { useState, useEffect } from "react";

function Imoveis() {
    const [modalidade, setModalidade] = useState('');
    const [dataToShow, setDataToShow] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading state

    const FilteredData = (data, modalidade) => {
        if (!modalidade) return data;
        return data.filter((imovel) => imovel.aluguel === (modalidade === 'aluguel' ? true : false));
    };

    useEffect(() => {
        fetchImoveis();
    }, []);

    const fetchImoveis = async () => {
        try {
            const response = await fetch('/api/imoveis');
            if (!response.ok) {
                throw new Error('Failed to fetch imoveis');
            }
            const data = await response.json();
            setDataToShow(data);
            setLoading(false); // Set loading to false once data is fetched
        } catch (error) {
            console.error('Error fetching imoveis:', error);
            setLoading(false); // Handle loading state in case of error
        }
    };

    const handleModalidadeClick = (newModalidade) => {
        setModalidade(newModalidade);
    };

    const filteredData = FilteredData(dataToShow, modalidade);

    return (
        <div className="flex flex-col min-h-screen">
            <title>Imoveis</title>
            <Header />
            <div className="flex flex-col sm:flex-row justify-center flex-grow">
                <aside className="w-fit p-4 sm:m-12 sm:mt-16 mt-8 shadow-md rounded-md items-start flex flex-row flex-wrap sm:flex-col h-full m-5">
                    <h2 className="text-3xl font-bold sm:mb-8 text-red-800 w-full">Finalidade</h2>
                    <div className="mb-2 flex sm:flex-col">
                        <button
                            onClick={() => handleModalidadeClick('aluguel')}
                            className={`p-2 m-3 rounded-sm shadow-md ${modalidade === 'aluguel' ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                        >
                            Locação
                        </button>
                        <button
                            onClick={() => handleModalidadeClick('venda')}
                            className={`p-2 m-3 rounded-sm shadow-md ${modalidade === 'venda' ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                        >
                            Venda
                        </button>
                    </div>
                </aside>
                <div className="flex flex-grow">
                    <div className="sm:w-11/12 w-full p-4">
                        {loading ? (
                            <SkeletonLoader /> // Show skeleton loader while loading
                        ) : (
                            <Cards tipoMostrado="Imoveis" dataToShow={filteredData} />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Imoveis;
