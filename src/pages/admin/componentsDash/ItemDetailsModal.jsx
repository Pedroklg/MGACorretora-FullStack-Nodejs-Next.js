import React, { useEffect, useState } from 'react';
import LoadingSpinner from './../../../components/animations/LoadingSpinner'; // Assuming this is where your LoadingSpinner component is defined

const ItemDetailsModal = ({ isOpen, onRequestClose, itemId }) => {
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && itemId) {
            setLoading(true);
            fetch(`/api/empresasImoveis?id=${itemId}`)
                .then(response => response.json())
                .then(data => {
                    setItemDetails(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching item details:', error);
                    setLoading(false);
                });
        } else {
            // Reset itemDetails when modal is closed
            setItemDetails(null);
        }
    }, [isOpen, itemId]);

    if (!isOpen || loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <LoadingSpinner isLoading={loading} />
            </div>
        );
    }

    if (!itemDetails) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
            <div className="rounded-lg m-5 md:p-8 md:max-w-4xl w-full md:w-3/4 flex flex-col items-center bg-white">
                <>
                    <h1 className="text-xl font-bold mb-4">Detalhes {itemDetails.tipo === "Empresa" ? <span>da Empresa</span> : <span>do Imóvel</span>}</h1>
                    <table className="w-full table-fixed">
                        <tbody>
                            <tr>
                                <td className="font-semibold break-words md:w-1/4">Titulo:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.titulo}</td>
                            </tr>
                            <tr className="bg-gray-200">
                                <td className="font-semibold break-words md:w-1/4">Valor:</td>
                                <td className="break-words md:w-3/4">R$ {itemDetails.item.valor_pretendido}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold break-words md:w-1/4">Estado:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.estado}</td>
                            </tr>
                            <tr className="bg-gray-200">
                                <td className="font-semibold break-words md:w-1/4">Cidade:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.cidade}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold break-words md:w-1/4">Sobre {itemDetails.tipo === "Empresa" ? <span>a Empresa</span> : <span>o Imóvel</span>}</td>
                                <td className="break-words md:w-3/4 max-w-full">{itemDetails.item.sobre_o_imovel}</td>
                            </tr>
                            <tr className="bg-gray-200">
                                <td className="font-semibold break-words md:w-1/4">Motivo da Venda:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.motivo_da_venda}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold break-words md:w-1/4">Condições:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.condicoes}</td>
                            </tr>
                            <tr className="bg-gray-200">
                                <td className="font-semibold break-words md:w-1/4">Aceita Permuta:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.aceita_permuta ? 'Sim' : 'Não'}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold break-words md:w-1/4">Tem Dívida:</td>
                                <td className="break-words md:w-3/4">{itemDetails.item.tem_divida ? 'Sim' : 'Não'}</td>
                            </tr>
                            {itemDetails.tipo === 'Empresa' ?
                                <>
                                    <tr className="bg-gray-200">
                                        <td className="font-semibold break-words md:w-1/4">Categoria:</td>
                                        <td className="break-words md:w-3/4">{itemDetails.item.categoria}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold break-words md:w-1/4">Tempo de Mercado:</td>
                                        <td className="break-words md:w-3/4">{itemDetails.item.tempo_de_mercado} {itemDetails.item.tempo_de_mercado === 1 ? 'ano' : 'anos'}</td>
                                    </tr>
                                    <tr className="bg-gray-200">
                                        <td className="font-semibold break-words md:w-1/4">Funcionários:</td>
                                        <td className="break-words md:w-3/4">{itemDetails.item.funcionarios}</td>
                                    </tr>
                                </>
                                :
                                <>
                                    <tr className="bg-gray-200">
                                        <td className="font-semibold break-words md:w-1/4">Área Construida:</td>
                                        <td className="break-words md:w-3/4">{itemDetails.item.area_construida} m²</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold break-words md:w-1/4">Área Útil:</td>
                                        <td className="break-words md:w-3/4">{itemDetails.item.area_util} m²</td>
                                    </tr>
                                    <tr className="bg-gray-200">
                                        <td className="font-semibold break-words md:w-1/4">Finalidade:</td>
                                        <td className="break-words md:w-3/4">{itemDetails.item.aluguel ? 'Aluguel' : 'Venda'}</td>
                                    </tr>
                                </>
                            }
                            <tr>
                                <td className="font-semibold break-words md:w-1/4">Imagem:</td>
                                <td className="break-words md:w-3/4 max-w-full overflow-hidden">{itemDetails.item.imagem}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex mt-4"
                    onClick={onRequestClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ItemDetailsModal;
