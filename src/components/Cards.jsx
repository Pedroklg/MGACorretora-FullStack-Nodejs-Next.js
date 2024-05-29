import React, { useState } from 'react';
import useFetchData from '../pages/api/utils/useFetchData';

const CardsEmpresas = ({ tipoMostrado = 'ambos', dataToShow }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(12);

  // Ensure dataToShow is always an array
  const filteredData = Array.isArray(dataToShow) ? dataToShow : useFetchData(tipoMostrado);

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = pageNumber => setCurrentPage(pageNumber);

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
        {currentCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={card.imagem} alt={card.titulo} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{card.titulo}</h2>
              <p className="text-gray-700">{card.cidade} - {card.estado}</p>
              <p className="text-gray-700">R$ {card.valor_pretendido * 0.10},00</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <nav className="inline-flex">
          {[...Array(Math.ceil(filteredData.length / cardsPerPage)).keys()].map(number => (
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
