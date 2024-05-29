import React, { useState, useEffect } from 'react';
import { IconEye, IconEdit, IconTrash, IconSearchSmall } from '../../../components/Icones';
import useFetchData from '../../../pages/api/utils/useFetchData';
import FilteredData from '../../../pages/api/utils/FilteredData';

const EmpresasImoveisTable = ({ tipoMostrado }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const dataToShow = useFetchData(tipoMostrado);

    const itemsPerPage = 9;
    let titulo;

    // Function to filter data based on search term
    // Function to filter data based on search term
    const filteredData = FilteredData(dataToShow, searchTerm);


    if (tipoMostrado === "Empresas") {
        titulo = "Empresas cadastradas";
    } else if (tipoMostrado === "Imoveis") {
        titulo = "Imóveis cadastrados";
    } else {
        titulo = "Empresas e Imóveis cadastrados";
    }

    // Calculate index of the last item for current page
    const indexOfLastItem = currentPage * itemsPerPage;
    // Calculate index of the first item for current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Slice the filtered data array to display only items for the current page
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle pagination
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to the top of the table after pagination
        window.scrollTo(0, 0);
    };

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset current page when search term changes
    };

    return (
        <div className="h-svh p-0 m-5 w-svw overflow-hidden bg-gray-200 rounded-xl"
            style={{ height: 'calc(100vh - 3rem)' }}>
            <div className="p-8 grid gap-8">
                <div className="flex items-center justify-items-center shadow-lg rounded-lg p-5">
                    <h2 className="text-3xl font-bold">{titulo}</h2>
                    <div className="ml-20">
                        <input
                            type="text"
                            className="w-60 rounded-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange} // Call handleSearchChange on input change
                        />
                    </div>
                    <button className="bg-red-800 rounded-sm text-white px-1 py-0.5 ml-3">
                        {IconSearchSmall}
                    </button>
                </div>
                <div className="p-4 grid shadow-lg rounded-sm">
                    <table>
                        <thead className="border-b-2 border-red-800">
                            <tr className="grid grid-cols-12 text-xl">
                                <th className="col-span-1 px-4 py-3 text-left">ID</th>
                                <th className="col-span-2 px-4 py-3 text-left">Título</th>
                                <th className="col-span-3 px-4 py-3 text-left">Valor Pretendido</th>
                                <th className="col-span-3 px-4 py-3 text-left">Sobre o Imovel</th>
                                <th className="col-span-1 px-4 py-3 text-left">Detalhes</th>
                                <th className="col-span-1 px-4 py-3 text-left">Editar</th>
                                <th className="col-span-1 px-4 py-3 text-left">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200 grid grid-cols-12">
                                    <td className="col-span-1 px-4 py-4">{item.id}</td>
                                    <td className="col-span-2 px-4 py-4">{item.titulo}</td>
                                    <td className="col-span-3 px-4 py-4">R$ {item.valor_pretendido}</td>
                                    <td className="col-span-3 px-4 py-4">{item.sobre_o_imovel}</td>
                                    <td className="col-span-1 px-4 py-3">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            {IconEye}
                                        </button>
                                    </td>
                                    <td className="col-span-1 px-4 py-3">
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
                                            {IconEdit}
                                        </button>
                                    </td>
                                    <td className="col-span-1 px-4 py-3">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            {IconTrash}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <div className="flex">
                        {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number + 1)}
                                className={`${currentPage === number + 1
                                    ? 'bg-blue-500 hover:bg-blue-700 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    } font-bold py-2 px-4 rounded mx-1`}
                            >
                                {number + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmpresasImoveisTable;
