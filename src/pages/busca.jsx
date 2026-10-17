import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/animations/SkeletonLoader';
import EncontrarEmpresa from '../components/EncontrarEmpresa';
import Seo from '../components/Seo';

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

        if (router.isReady) {
            fetchData();
        }
    }, [router.isReady, q, estado, cidade, bairro, categoria, minPrice, maxPrice, finalidade, searchMode]);
    const tipoMostrado = searchMode ? (searchMode === 'empresas' ? 'Empresas' : searchMode === 'imoveis' ? 'Imoveis' : 'ambos') : 'ambos';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Resultados de busca não devem ser indexados (conteúdo duplicado/infinito); o robots.txt deixa acessar para o noindex ser lido */}
            <Seo
                title={q ? `Busca: ${q}` : 'Resultados da busca'}
                description="Resultados da busca no site da MGA Corretora"
                noindex
            />
            <Header />
            <div className='w-full flex items-center justify-center'>
                <div className='lg:w-10/12 w-full'>
                    <EncontrarEmpresa tipoMostrado={tipoMostrado}/>
                </div>
            </div>
            <main className="flex-grow">
                <h1 className="sr-only">Resultados da busca</h1>
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
