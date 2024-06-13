import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import SkeletonLoader from "../components/animations/SkeletonLoader"; // Import the SkeletonLoader component
import { useState, useEffect } from "react";

function Imoveis() {
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [dataToShow, setDataToShow] = useState([]);

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

    return (
        <div className="flex flex-col min-h-screen">
            <title>Imóveis</title>
            <Header />
            <div className="flex flex-grow">
                {loading ? (
                    <SkeletonLoader /> // Show skeleton loader while loading
                ) : (
                    <Cards tipoMostrado="Imoveis" dataToShow={dataToShow} />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Imoveis;