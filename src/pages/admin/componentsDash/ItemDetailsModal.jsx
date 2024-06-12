import React, { useEffect, useState } from 'react';

const ItemDetailsModal = ({ isOpen, onRequestClose, itemId }) => {
    const [itemDetails, setItemDetails] = useState(null);

    useEffect(() => {
        if (isOpen && itemId) {
            fetch(`/api/empresasImoveis?id=${itemId}`)
                .then(response => response.json())
                .then(data => setItemDetails(data))
                .catch(error => console.error('Error fetching item details:', error));
        } else {
            // Reset itemDetails when modal is closed
            setItemDetails(null);
        }
    }, [isOpen, itemId]);

    if (!isOpen || !itemDetails) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg m-5 md:p-8 md:max-w-4xl w-4/4 md:w-3/4 flex flex-col items-center bg-white">
                {itemDetails ? (
                    <>
                        <h1 className="text-xl font-bold mb-4">Detalhes {itemDetails.tipo === "Empresa" ? <span>da Empresa</span> : <span>do Imóvel</span>}</h1>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="font-semibold">Titulo:</td>
                                    <td>{itemDetails.item.titulo}</td>
                                </tr>
                                <tr className="bg-gray-200">
                                    <td className="font-semibold">Valor:</td>
                                    <td>R$ {itemDetails.item.valor_pretendido}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Estado:</td>
                                    <td>{itemDetails.item.estado}</td>
                                </tr>
                                <tr className="bg-gray-200">
                                    <td className="font-semibold">Cidade:</td>
                                    <td>{itemDetails.item.cidade}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Sobre {itemDetails.tipo === "Empresa" ? <span>a Empresa</span> : <span>o Imóvel</span>}</td>
                                    <td className="flex flex-wrap">{itemDetails.item.sobre_o_imovel}</td>
                                </tr>
                                <tr className="bg-gray-200">
                                    <td className="font-semibold">Motivo da Venda:</td>
                                    <td>{itemDetails.item.motivo_da_venda}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Condições:</td>
                                    <td>{itemDetails.item.condicoes}</td>
                                </tr>
                                <tr className="bg-gray-200">
                                    <td className="font-semibold">Aceita Permuta:</td>
                                    <td>{itemDetails.item.aceita_permuta ? 'Sim' : 'Não'}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Tem Dívida:</td>
                                    <td>{itemDetails.item.tem_divida ? 'Sim' : 'Não'}</td>
                                </tr>
                                {itemDetails.tipo === 'Empresa' ?
                                    <>
                                        <tr className="bg-gray-200">
                                            <td className="font-semibold">Categoria:</td>
                                            <td>{itemDetails.item.categoria}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Tempo de Mercado:</td>
                                            <td>{itemDetails.item.tempo_de_mercado} {itemDetails.item.tempo_de_mercado === 1 ? 'ano' : 'anos'}</td>
                                        </tr>
                                        <tr className="bg-gray-200">
                                            <td className="font-semibold">Funcionários:</td>
                                            <td>{itemDetails.item.funcionarios}</td>
                                        </tr>
                                    </>
                                    :
                                    <>
                                        <tr className="bg-gray-200">
                                            <td className="font-semibold">Área Construida:</td>
                                            <td>{itemDetails.item.area_construida} m²</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Área Útil:</td>
                                            <td>{itemDetails.item.area_util} m²</td>
                                        </tr>
                                        <tr className="bg-gray-200">
                                            <td className="font-semibold">Finalidade:</td>
                                            <td>{itemDetails.item.aluguel ? 'Aluguel' : 'Venda'}</td>
                                        </tr>
                                    </>
                                }
                                <tr>
                                    <td className="font-semibold">Imagem:</td>
                                    <td className='flex flex-wrap'>{itemDetails.item.imagem}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
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
