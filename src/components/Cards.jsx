import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toBrMoney from '@/lib/toBrMoney';
import { listingPath } from '@/lib/site';
import Image from 'next/image';
import SkeletonLoader from './animations/SkeletonLoader';
import { IconDown, IconMapPin, IconUp } from './Icons';

const parsePrice = (value) => parseFloat(String(value ?? '').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;

const CardsEmpresas = ({ tipoMostrado = 'ambos', dataToShow, titleTag: TitleTag = 'h2' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedData, setFetchedData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [previousData, setPreviousData] = useState(dataToShow);
  const cardsPerPage = 12;

  // Volta para a primeira página quando os dados mudam (ex.: filtro de categoria)
  if (previousData !== dataToShow) {
    setPreviousData(dataToShow);
    setCurrentPage(1);
  }

  const currentData = dataToShow || fetchedData || [];
  const loading = !dataToShow && fetchedData === null;

  useEffect(() => {
    if (dataToShow) return;

    let cancelled = false;
    const fetchData = async () => {
      try {
        const url = `/api/tipoSearch?tipoMostrado=${encodeURIComponent(tipoMostrado)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (!cancelled) setFetchedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!cancelled) setFetchedData([]);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [dataToShow, tipoMostrado]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      setSortConfig({
        key,
        direction: 'ascending',
      });
    }
  };

  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      const sortableData = [...currentData];
      sortableData.sort((a, b) => {
        const aValue = parsePrice(a[sortConfig.key]);
        const bValue = parsePrice(b[sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      return sortableData;
    } else {
      return currentData;
    }
  }, [currentData, sortConfig]);

  let titulo;
  if (tipoMostrado === "Empresas") {
    titulo = "Empresas";
  } else if (tipoMostrado === "Imoveis") {
    titulo = "Imóveis";
  } else {
    titulo = "Empresas e Imóveis";
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 m-5">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 m-5">
      <div className="flex items-center mb-6">
        <TitleTag className="text-4xl font-bold text-red-700">
          {titulo}
        </TitleTag>
        <div className="flex-grow h-px bg-red-700 ml-4 p-0.5 rounded-md"></div>
        <button className="text-lg text-gray-100 p-1 m-2 rounded-md shadow-md bg-red-800" onClick={() => handleSort('valor_pretendido')}>
          <span className='flex items-center justify-center gap-1'>
            <span className='hidden sm:flex'>Ordenar por</span> Preço {sortConfig.key === 'valor_pretendido' && (
              <span>
                {sortConfig.direction === 'ascending' ? IconUp : IconDown}
              </span>
            )}
          </span>
        </button>
      </div>
      {currentData.length === 0 ?
        <div className='text-center text-3xl font-semibold text-black flex justify-center'>
          <span className=''>Nenhum resultado encontrado</span>
        </div>
        :
        ""}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedData.slice(indexOfFirstCard, indexOfLastCard).map((card, index) => (
          <Link key={card.id} href={listingPath(card)}>
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out"
              >
                <Image
                  src={card.imagem ? card.imagem : '/placeholder.png'}
                  alt={card.titulo}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  priority={index < 4}
                />
                <div className="p-6 flex flex-col">
                  <h3 className="xl:text-xl lg:text-lg md:text-base sm:text-xl font-bold mb-2">{card.titulo}</h3>
                  <div className="text-gray-700 flex items-center gap-1">
                    <span className='flex items-center text-green-700 mb-0.5'>{IconMapPin}</span>
                    {card.cidade} - {card.estado}
                  </div>
                  {card.bairro ?
                  <p className="text-green-700 text-sm ml-4">{card.bairro}</p>
                  : 
                  <div className='h-5 ml-4'></div>
                  }
                  <p className="text-yellow-600 text-xl font-semibold">{toBrMoney(card.valor_pretendido)}</p>
                </div>
              </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <nav className="inline-flex" aria-label="Paginação">
          {[...Array(Math.ceil(sortedData.length / cardsPerPage)).keys()].map((number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              aria-current={currentPage === number + 1 ? 'page' : undefined}
              className={`mx-1 px-3 py-1 rounded-md ${currentPage === number + 1 ? 'bg-red-800 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              {number + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CardsEmpresas;