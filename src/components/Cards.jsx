import React, { useState } from 'react';
import useFetchData from '../pages/api/utils/useFetchData';
import { useRouter } from 'next/router';
import toBrMoney from '../pages/api/utils/toBrMoney';
import Image from 'next/image';

const CardsEmpresas = ({ tipoMostrado = 'ambos', dataToShow }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const router = useRouter();

  // Fetch data regardless of the dataToShow prop
  const fetchedData = useFetchData(tipoMostrado);

  // Ensure dataToShow is always an array or use fetchedData if dataToShow is not provided
  const filteredData = Array.isArray(dataToShow) ? dataToShow : fetchedData;

  // Calculate indexes for slicing data based on pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle card click
  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  // Determine title based on tipoMostrado
  let titulo;
  if (tipoMostrado === "Empresas") {
    titulo = "Empresas";
  } else if (tipoMostrado === "Imoveis") {
    titulo = "Imóveis";
  } else {
    titulo = "Empresas e Imóveis";
  }

  // Conditional rendering for empty search results
  if (filteredData.length === 0) {
    return (
      <div className="container mx-auto p-4 m-5">
        <h4 className='flex justify-center w-full text-4xl text-red-800'>Nada encontrado conforme sua busca!</h4>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 m-5">
      <div className="flex items-center mb-6">
        <h1 className="text-4xl font-bold text-red-700">
          {titulo}
        </h1>
        <div className="flex-grow h-px bg-red-700 ml-4 p-0.5 rounded-md"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:cursor-pointer hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => handleCardClick(card.id)} // Navigate to product page on click
          >
            <Image
              src={encodeURIComponent(card.imagem)}
              alt={card.titulo}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{card.titulo}</h2>
              <p className="text-gray-700">{card.cidade} - {card.estado}</p>
              <p className="text-gray-700">{toBrMoney(card.valor_pretendido)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <nav className="inline-flex">
          {[...Array(Math.ceil(filteredData.length / cardsPerPage)).keys()].map((number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
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
