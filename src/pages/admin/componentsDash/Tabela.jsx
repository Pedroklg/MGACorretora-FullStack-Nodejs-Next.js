import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import FilteredData from '../../../pages/api/utils/FilteredData';
import { IconEye, IconEdit, IconTrash, IconSearchSmall } from '../../../components/Icones';
import { ItemContext } from '../../../context/ItemContext';
import ItemDetailsModal from './ItemDetailsModal'; // Import the modal component
import toBrMoney from '../../../pages/api/utils/toBrMoney';
import ProgressBar from '../../../components/animations/ProgressBar'; // Import the ProgressBar component

const EmpresasImoveisTable = ({ tipoMostrado, setShowRegistrar }) => {
    const { setItemToEdit } = useContext(ItemContext) || {};
    const [dataToShow, setDataToShow] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null); // State to store selected item id
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to manage modal visibility
    const [loading, setLoading] = useState(false); // State to manage loading state

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/tipoSearch?tipoMostrado=${tipoMostrado}`);
                const data = await response.json();
                setDataToShow(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tipoMostrado]);

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
            setLoading(true);
            const response = await fetch(`/api/empresasImoveis?id=${id}`);
            const data = await response.json();
            setLoading(false);
            if (!response.ok) {
                throw new Error('Failed to fetch item details');
            }
            setSelectedItemId(id);
            setIsModalOpen(true);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error('Error fetching item details:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/empresasImoveis?id=${id}`, {
                method: 'DELETE'
            });
            setLoading(false);
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            alert('Item deleted successfully');
            window.location.reload();
        } catch (error) {
            setError(error.message);
            setLoading(false);
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
        <div className="min-h-svh h-fit p-0 w-svw overflow-scroll">
            <ProgressBar loading={loading} />
            <div className="md:p-5 grid md:gap-8">
                <div className="flex flex-col md:flex-row items-center justify-items-center shadow-lg rounded-lg p-5">
                    <h2 className="text-xl md:text-3xl font-bold">{titulo}</h2>
                    <div className="md:ml-20 flex justify-center items-center">
                        <input
                            type="text"
                            className="w-60 rounded-sm p-1"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="bg-red-800 rounded-sm text-white px-1 py-0.5 ml-3">
                            {IconSearchSmall}
                        </button>
                    </div>
                </div>
                <div className="p-4 grid shadow-lg rounded-sm">
                    <table>
                        <thead className="border-b-2 border-red-800">
                            <tr className="grid grid-cols-12 text-xl">
                                <th className="col-span-1 md:px-4 md:py-3 text-left">ID</th>
                                <th className="col-span-4 md:col-span-2 md:px-4 md:py-3 text-left">Título</th>
                                <th className="col-span-4 md:col-span-2 md:px-4 md:py-3 text-left">Valor Pretendido</th>
                                <th className="hidden md:col-span-4 md:px-4 md:py-3 md:block text-left">Sobre o Imovel</th>
                                <th className="col-span-1 md:px-4 md:py-3 hidden md:block text-left">Detalhes</th>
                                <th className="col-span-1 md:px-4 md:py-3 hidden md:block text-left">Editar</th>
                                <th className="col-span-1 md:px-4 md:py-3 hidden md:block text-left">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200 grid grid-cols-12">
                                    <td className="col-span-1 md:px-4 md:py-3 text-left">{item.id}</td>
                                    <td className="col-span-4 md:col-span-2 md:px-4 md:py-3 text-left">{item.titulo}</td>
                                    <td className="col-span-4 md:col-span-2 md:px-4 md:py-3 text-left">{toBrMoney(item.valor_pretendido)}</td>
                                    <td className="hidden md:col-span-4 px-4 md:py-3 md:block text-left">
                                        {item.sobre_o_imovel.length > 50
                                            ? `${item.sobre_o_imovel.slice(0, 50)}...`
                                            : item.sobre_o_imovel
                                        }
                                    </td>
                                    <td className="col-span-1 md:px-4 py-3 text-left">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.5 px-0.5 md:py-2 md:px-4 rounded"
                                            onClick={() => handleDetails(item.id)}>
                                            {IconEye}
                                        </button>
                                    </td>
                                    <td className="col-span-1 md:px-4 py-3 text-left">
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-0.5 px-0.5 font-bold md:py-2 md:px-4 rounded"
                                            onClick={() => handleEdit(item.id)}>
                                            {IconEdit}
                                        </button>
                                    </td>
                                    <td className="col-span-1 md:px-4 py-3 text-left">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-0.5 px-0.5 md:py-2 md:px-4 rounded"
                                            onClick={() => handleDelete(item.id)}>
                                            {IconTrash}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-5">
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