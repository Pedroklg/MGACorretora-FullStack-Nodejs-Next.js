import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Search = () => {
  const router = useRouter();
  const { q, estado, cidade, categoria, minPrice, maxPrice } = router.query;

  const [dataToShow, setDataToShow] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let url = '';
      let queryParams = {};

      if (q) {
        // Handle search by query term (q)
        queryParams = { query: q };
        url = `/api/globalSearch?${new URLSearchParams(queryParams).toString()}`;
      } else if (estado || cidade || categoria || minPrice || maxPrice) {
        // Handle search by various parameters
        if (estado) queryParams.estado = estado;
        if (cidade) queryParams.cidade = cidade;
        if (categoria) queryParams.categoria = categoria;
        if (minPrice) queryParams.minPrice = minPrice;
        if (maxPrice) queryParams.maxPrice = maxPrice;
        
        url = `/api/especificSearch?${new URLSearchParams(queryParams).toString()}`;
      }

      if (!url) return;

      try {
        console.log('Fetching data...');
        console.log('Request URL:', url);

        const response = await fetch(url);
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Received data:', data);

        setDataToShow(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [q, estado, cidade, categoria, minPrice, maxPrice]);

  return (
    <div className="flex flex-col min-h-screen">
      <title>Resultado da Busca</title>
      <Header />
      <main className="flex-grow">
        <Cards dataToShow={dataToShow} />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
