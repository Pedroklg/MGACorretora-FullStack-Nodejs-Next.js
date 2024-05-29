import { useState, useEffect } from 'react';

const useFetchData = (tipoMostrado) => {
  const [dataToShow, setDataToShow] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data?tipoMostrado=${tipoMostrado}`);
        const data = await response.json();
        setDataToShow(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tipoMostrado]);

  return dataToShow;
};

export default useFetchData;
