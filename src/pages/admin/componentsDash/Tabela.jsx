import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import useFetchData from '../../../pages/api/utils/useFetchData';
import FilteredData from '../../../pages/api/utils/FilteredData';
import { IconEye, IconEdit, IconTrash, IconSearchSmall } from '../../../components/Icones';
import { ItemContext } from './context/ItemContext';
import ItemDetailsModal from './ItemDetailsModal'; // Import the modal component

const EmpresasImoveisTable = ({ tipoMostrado, setShowRegistrar }) => {
    const { setItemToEdit } = useContext(ItemContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null); // State to store selected item id
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to manage modal visibility

    const router = useRouter();

    const dataToShow = useFetchData(tipoMostrado);

    const itemsPerPage = 9;
    const filteredData = FilteredData(dataToShow, searchTerm);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    let titulo;
    if (tipoMostrado === "Empresas") {
        titulo = "Empresas cadastradas";
    } else if (tipoMostrado === "Imoveis") {
        titulo = "Imóveis cadastrados";
    } else {
        titulo = "Empresas e Imóveis cadastrados";
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleDetails = async (id) => {
        try {
            const response = await fetch(`/api/empresasImoveis?id=${id}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch item details');
            }
            setSelectedItemId(id);
            setIsModalOpen(true);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching item details:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/empresasImoveis?id=${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            alert('Item deleted successfully');
            window.location.reload();
        } catch (error) {
            setError(error.message);
            console.error('Error deleting item:', error);
        }
    };

    const handleEdit = (id) => {
        const itemToEdit = currentItems.find(item => item.id === id);
        if (itemToEdit) {
            setShowRegistrar(true);
            setItemToEdit(itemToEdit);
            setSelectedItemId(id);
        }
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
                            onChange={handleSearchChange}
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
                                <th className="col-span-2 px-4 py-3 text-left">Valor Pretendido</th>
                                <th className="col-span-4 px-4 py-3 text-left">Sobre o Imovel</th>
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
                                    <td className="col-span-2 px-4 py-4">R$ {item.valor_pretendido}</td>
                                    <td className="col-span-4 px-4 py-4">
                                        {item.sobre_o_imovel.length > 50
                                            ? `${item.sobre_o_imovel.slice(0, 50)}...`
                                            : item.sobre_o_imovel
                                        }
                                    </td>
                                    <td className="col-span-1 px-4 py-3">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleDetails(item.id)}>
                                            {IconEye}
                                        </button>
                                    </td>
                                    <td className="col-span-1 px-4 py-3">
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleEdit(item.id)}>
                                            {IconEdit}
                                        </button>
                                    </td>
                                    <td className="col-span-1 px-4 py-3">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleDelete(item.id)}>
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
                        className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l ${currentPage === 1 ? 'disabled' : ''}`}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <div className="flex">
                        {[...Array(totalPages).keys()].map(number => (
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
                        className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r ${currentPage === totalPages ? 'disabled' : ''
                            }`}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal Component */}
            {isModalOpen && (
                <ItemDetailsModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    itemId={selectedItemId} // Pass the selected item id to the modal
                />
            )}
        </div>
    );
};

export default EmpresasImoveisTable;