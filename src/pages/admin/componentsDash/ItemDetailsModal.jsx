import React, { useEffect, useState } from 'react';
import LoadingSpinner from './../../../components/animations/LoadingSpinner';
import toBrMoney from './../../api/utils/toBrMoney';
import Image from 'next/image';

const ItemDetailsModal = ({ isOpen, onRequestClose, itemId }) => {
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (isOpen && itemId) {
                setLoading(true);
                try {
                    const response = await fetch(`/api/idSearch?id=${itemId}`);
                    const data = await response.json();
                    setItemDetails(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching item details:', error);
                    setLoading(false);
                }
            } else {
                setItemDetails(null);
            }
        };

        fetchItemDetails();
    }, [isOpen, itemId]);

    // Ensure modal content is not rendered if closed or loading
    if (!isOpen || loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <LoadingSpinner isLoading={loading} />
            </div>
        );
    }

    if (!itemDetails) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="rounded-lg m-3 p-3 md:p-8 md:max-w-4xl w-full md:w-3/4 flex flex-col items-center bg-white overflow-y-auto max-h-full">
                <h1 className="text-xl font-bold md:mb-4">
                    Detalhes {itemDetails.tipo === "Empresa" ? <span>da Empresa</span> : <span>do Imóvel</span>}
                </h1>
                <div className="overflow-y-auto max-h-full">
                    <table className="w-full">
                        <tbody className='p-2'>
                            {Object.entries(itemDetails.item).map(([key, value], index) => {
                                const label = mapKeyToLabel(key);
                                const component = mapValueToComponent(key, value);

                                // Skip rendering if component is null or undefined
                                if (component == null) {
                                    return null;
                                }

                                return (
                                    <tr key={key} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                        <td className="font-semibold break-words md:w-1/4">{label}</td>
                                        <td className="break-words md:w-3/4">{component}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
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

// Helper function to map database keys to display labels
const mapKeyToLabel = (key) => {
    switch (key) {
        case 'titulo':
            return 'Título:';
        case 'valor_pretendido':
            return 'Valor:';
        case 'estado':
            return 'Estado:';
        case 'cidade':
            return 'Cidade:';
        case 'bairro':
            return 'Bairro:';
        case 'descricao':
            return 'Descrição:';
        case 'motivo_da_venda':
            return 'Motivo da Venda:';
        case 'condicoes':
            return 'Condições:';
        case 'aceita_permuta':
            return 'Aceita Permuta:';
        case 'tem_divida':
            return 'Tem Dívida:';
        case 'data_registro':
            return 'Data de Registro:';
        case 'categoria':
            return 'Categoria:';
        case 'tempo_de_mercado':
            return 'Tempo de Mercado:';
        case 'funcionarios':
            return 'Funcionários:';
        case 'area_construida':
            return 'Área Construída:';
        case 'area_util':
            return 'Área Útil:';
        case 'aluguel':
            return 'Finalidade:';
        case 'funcionamento':
            return 'Funcionamento:';
        case 'sobre_imovel':
            return 'Sobre o Imóvel:';
        case 'imagem':
            return 'Imagem Principal:';
        case 'details_images':
            return 'Imagens Adicionais:';
        default:
            return key;
    }
};

// Helper function to render values based on key
const mapValueToComponent = (key, value) => {
    switch (key) {
        case 'valor_pretendido':
            return toBrMoney(value);
        case 'aceita_permuta':
        case 'tem_divida':
            return value ? 'Sim' : 'Não';
        case 'aluguel':
            return value ? 'Aluguel' : 'Venda';
        case 'imagem':
            return <Image src={value} alt="Imagem" width={115} height={85} />;
        case 'details_images':
            if (!value || value.length === 0) return ('Sem imagens')
            return (
                <div className='flex flex-row flex-wrap gap-1'>
                    {value.map((image, index) => (
                        <Image key={index} src={image} alt={`Imagem ${index + 1}`} width={115} height={85} />
                    ))}
                </div>
            );
        default:
            return value;
    }
};

export default ItemDetailsModal;
