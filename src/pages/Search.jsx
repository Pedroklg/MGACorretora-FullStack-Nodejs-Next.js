import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/animations/SkeletonLoader';
import EncontrarEmpresa from '../components/EncontrarEmpresa';
import Head from 'next/head';

const Search = () => {
    const router = useRouter();
    const { q, cidade, estado, bairro, categoria, finalidade, minPrice, maxPrice, searchMode } = router.query;
    const [loading, setLoading] = useState(true);
    const [dataToShow, setDataToShow] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let url = '';
            let queryParams = {};

            if (q) {
                queryParams = { query: q };
                url = `/api/globalSearch?${new URLSearchParams(queryParams).toString()}`;
            } else if (estado || cidade || bairro || categoria || finalidade || minPrice || maxPrice) {
                if (estado) queryParams.estado = estado;
                if (cidade) queryParams.cidade = cidade;
                if (bairro) queryParams.bairro = bairro;
                if (categoria) queryParams.categoria = categoria;
                if (finalidade) queryParams.finalidade = finalidade;
                if (minPrice) queryParams.minPrice = minPrice;
                if (maxPrice) queryParams.maxPrice = maxPrice;
                if (searchMode) queryParams.searchMode = searchMode;

                url = `/api/especificSearch?${new URLSearchParams(queryParams).toString()}`;
            } else {
                url = '/api/tipoSearch';
            }

            if (!url) return;

            try {
                setLoading(true);

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();

                setDataToShow(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        if (q || estado || cidade || bairro || categoria || finalidade || minPrice || maxPrice || searchMode) {
            fetchData();
        }
    }, [q, estado, cidade, bairro, categoria, minPrice, maxPrice, finalidade, searchMode]);
    const tipoMostrado = searchMode ? (searchMode === 'empresas' ? 'Empresas' : searchMode === 'imoveis' ? 'Imoveis' : 'ambos') : 'ambos';

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Resultados da Busca - MGA</title>
                <meta name="description" content="Resultados da busca realizada no site da MGA Corretora" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <div className='w-full flex items-center justify-center'>
                <div className='lg:w-10/12 w-full'>
                    <EncontrarEmpresa tipoMostrado={tipoMostrado}/>
                </div>
            </div>
            <main className="flex-grow">
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <Cards dataToShow={dataToShow} tipoMostrado={tipoMostrado} />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Search;
