import { useState, useEffect } from 'react';
import Router from 'next/router';
import FilteredData from '../../../pages/api/utils/FilteredData';
import { IconEye, IconEdit, IconTrash, IconSearch } from '../../../components/Icons';
import ItemDetailsModal from './ItemDetailsModal';
import toBrMoney from '../../../pages/api/utils/toBrMoney';
import ProgressBar from '../../../components/animations/ProgressBar';
import { showErrorToast, showSuccessToast } from '../../../components/animations/toastService';

const EmpresasImoveisTable = ({ tipoMostrado }) => {
    const [dataToShow, setDataToShow] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null); // State to store selected item id
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to manage modal visibility
    const [loading, setLoading] = useState(false); // State to manage loading state

    // Function to fetch data based on tipoMostrado
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/tipoSearch?tipoMostrado=${tipoMostrado}`);
            const data = await response.json();
            setDataToShow(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showErrorToast('Erro ao buscar dados!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch when tipoMostrado changes
    }, [tipoMostrado]);

    // Function to handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Function to handle opening item details modal
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
            setLoading(false);
            showErrorToast('Erro ao exibir detalhes do item!');
            console.error('Erro ao exibir item details:', error);
        }
    };

    // Function to handle item deletion
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/empresasImoveis?id=${id}`, {
                method: 'DELETE'
            });
            setLoading(false);
            if (!response.ok) {
                throw new Error('Falha ao deletar item!');
            }
            showSuccessToast('Item deletado com sucesso!');
            fetchData(); // Fetch data again after successful deletion to update table
        } catch (error) {
            setLoading(false);
            console.error('Error deleting item:', error);
            showErrorToast('Erro ao deletar item!');
        }
    };

    // Function to handle editing an item
    const handleEdit = (id) => {
        Router.push('/admin/Registrar?id=' + id);
    };


    // Function to paginate through table pages
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Calculate items per page and current page items
    const itemsPerPage = 9;
    const filteredData = FilteredData(dataToShow, searchTerm);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Determine table title based on tipoMostrado
    let titulo;
    if (tipoMostrado === "Empresas") {
        titulo = "Empresas cadastradas";
    } else if (tipoMostrado === "Imoveis") {
        titulo = "Imóveis cadastrados";
    } else {
        titulo = "Empresas e Imóveis cadastrados";
    }

    return (
        <div className="min-h-svh h-fit p-0 w-svw">
            <ProgressBar loading={loading} />
            <div className="xl:p-5 grid xl:gap-8">
                <div className="flex flex-col xl:flex-row items-center justify-items-center shadow-lg rounded-lg p-5">
                    <h2 className="text-xl xl:text-3xl font-bold">{titulo}</h2>
                    <div className="xl:ml-20 flex justify-center items-center">
                        <input
                            type="text"
                            className="w-60 rounded-sm p-1"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="bg-red-800 rounded-sm text-white px-1 py-0.5 ml-3">
                            {IconSearch(6)}
                        </button>
                    </div>
                </div>
                <div className="p-4 grid shadow-lg rounded-sm">
                    <table>
                        <thead className="border-b-2 border-red-800">
                            <tr className="grid grid-cols-12 text-xl">
                                <th className="col-span-1 xl:px-4 xl:py-3 text-left">ID</th>
                                <th className="col-span-4 xl:col-span-2 xl:px-4 xl:py-3 text-left">Título</th>
                                <th className="col-span-4 xl:col-span-2 xl:px-4 xl:py-3 text-left">Valor Pretendido</th>
                                <th className="hidden xl:col-span-4 xl:px-4 xl:py-3 xl:block text-left">Sobre o Imovel</th>
                                <th className="col-span-1 xl:px-4 xl:py-3 hidden xl:block text-left">Detalhes</th>
                                <th className="col-span-1 xl:px-4 xl:py-3 hidden xl:block text-left">Editar</th>
                                <th className="col-span-1 xl:px-4 xl:py-3 hidden xl:block text-left">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200 grid grid-cols-12">
                                    <td className="col-span-1 xl:px-4 xl:py-3 text-left">{item.id}</td>
                                    <td className="col-span-4 xl:col-span-2 xl:px-4 xl:py-3 text-left">{item.titulo}</td>
                                    <td className="col-span-4 xl:col-span-2 xl:px-4 xl:py-3 text-left">{toBrMoney(item.valor_pretendido)}</td>
                                    <td className="hidden xl:col-span-4 px-4 xl:py-3 xl:block text-left">
                                        {item.sobre_o_imovel.length > 50
                                            ? `${item.sobre_o_imovel.slice(0, 50)}...`
                                            : item.sobre_o_imovel
                                        }
                                    </td>
                                    <td className="col-span-1 xl:px-4 py-3 text-left">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.5 px-0.5 md:py-1 md:px-1 xl:py-2 xl:px-4 rounded"
                                            onClick={() => handleDetails(item.id)}>
                                            {IconEye}
                                        </button>
                                    </td>
                                    <td className="col-span-1 xl:px-4 py-3 text-left">
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-0.5 px-0.5 md:py-1 md:px-1 font-bold xl:py-2 xl:px-4 rounded"
                                            onClick={() => handleEdit(item.id)}>
                                            {IconEdit}
                                        </button>
                                    </td>
                                    <td className="col-span-1 xl:px-4 py-3 text-left">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-0.5 px-0.5 md:py-1 md:px-1 xl:py-2 xl:px-4 rounded"
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