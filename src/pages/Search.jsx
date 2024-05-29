import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cards from '../components/Cards';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Search = () => {
  const router = useRouter();
  const { q, estado, cidade, categoria, minPrice, maxPrice, tipoMostrado } = router.query;

  const [dataToShow, setDataToShow] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams();
      if (q) queryParams.append('q', q);
      if (estado) queryParams.append('estado', estado);
      if (cidade) queryParams.append('cidade', cidade);
      if (categoria) queryParams.append('categoria', categoria);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
  
      try {
        console.log('Fetching data...');
        const url = `/api/data?tipoMostrado=${tipoMostrado || 'ambos'}&${queryParams.toString()}`;
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
  
    // Fetch data if any of the query parameters are present
    if (q || estado || cidade || categoria || minPrice || maxPrice) {
      fetchData();
    }
  }, [q, estado, cidade, categoria, minPrice, maxPrice, tipoMostrado]);
  console.log('Data to show:', dataToShow);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Cards dataToShow={dataToShow} />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
