import { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../../../../components/animations/LoadingSpinner';
import { NumericFormat } from 'react-number-format';
import { showErrorToast, showSuccessToast } from '../../../../components/animations/toastService';
import { useRouter } from 'next/router';

const ImoveisCRUD = ({ item }) => {
    const [loading, setLoading] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [savedOrUpdated, setSavedOrUpdated] = useState(false);
    const router = useRouter();
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const initialImovelData = {
        titulo: '',
        imagem: null,
        area_construida: '',
        area_util: '',
        aceita_permuta: false,
        tem_divida: false,
        motivo_da_venda: '',
        valor_pretendido: '',
        condicoes: '',
        descricao: '',
        estado: '',
        cidade: '',
        bairro: '',
        aluguel: false,
        details_images: [],
    };

    const [imovelData, setImovelData] = useState(initialImovelData);

    useEffect(() => {
        if (savedOrUpdated && !loading) {
            router.push('/admin/Dashboard');
        }
    }, [savedOrUpdated, loading, router]);

    useEffect(() => {
        if (item) {
            setLoading(true);
            setImovelData({
                ...item,
                details_images: item.details_images || Array(6).fill(null),
                imagem: item.imagem || null,
            });
            setLoading(false);
        }
    }, [item]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (unsavedChanges) {
                const message = 'Você tem mudanças não salvas. Tem certeza que deseja sair?';
                event.returnValue = message;
                return message;
            }
        };

        const handleRouteChange = (url) => {
            if (!savedOrUpdated && unsavedChanges && !window.confirm('Você tem mudanças não salvas. Tem certeza que deseja sair?')) {
                router.events.emit('routeChangeError');
                throw 'routeChange aborted.';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [unsavedChanges, savedOrUpdated, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setImovelData(prevData => ({ ...prevData, [name]: newValue }));
        setUnsavedChanges(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > MAX_FILE_SIZE) {
            showErrorToast('Tamanho do arquivo muito grande, limite: 10MB.');
            e.target.value = ''; // Clear the input
            return;
        }
        setEmpresaData(prevData => ({ ...prevData, imagem: file }));
        setUnsavedChanges(true);
    };

    const updateDetailsImage = (index, file) => {
        if (file && file.size > MAX_FILE_SIZE) {
            showErrorToast('Tamanho do arquivo muito grande, limite: 10MB.');
            return;
        }
        const updatedImages = [...empresaData.details_images];
        updatedImages[index] = file;
        setEmpresaData(prevData => ({ ...prevData, details_images: updatedImages }));
        setUnsavedChanges(true);
    };

    const handleRemoveDetailsImage = (index) => {
        const updatedImages = [...imovelData.details_images];
        updatedImages[index] = null;
        setImovelData(prevData => ({ ...prevData, details_images: updatedImages }));
        setUnsavedChanges(true);
    };

    const createOrUpdateImovel = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(imovelData).forEach(([key, value]) => {
                if (key === 'details_images') {
                    value.forEach((file, i) => {
                        if (file) {
                            formData.append(`details_images`, file);
                        }
                    });
                } else if (key === 'imagem' && value) {
                    formData.append('imagem', value);
                } else {
                    formData.append(key, value);
                }
            });

            const endpoint = item ? `/api/imoveis?id=${item.id}` : '/api/imoveis';
            const method = item ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Falha ao ${item ? 'atualizar' : 'criar'} imovel`);
            }

            setUnsavedChanges(false);
            setImovelData(initialImovelData);
            setSavedOrUpdated(true);
            showSuccessToast(`Imovel ${item ? 'atualizado' : 'criado'} com sucesso!`);
        } catch (error) {
            console.error(`Falha ao ${item ? 'atualizar' : 'criar'} imovel`, error.message);
            showErrorToast(`Falha ao ${item ? 'atualizar' : 'criar'} imovel`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await createOrUpdateImovel();
        } else {
            showErrorToast(`Preencha os campos: ${!imovelData.titulo ? 'Título, ' : ''}${!imovelData.valor_pretendido ? 'Valor' : ''},
                ${!imovelData.cidade ? 'Cidade, ' : ''}${!imovelData.estado ? 'Estado, ' : ''}${!imovelData.imagem ? 'Imagem' : ''}`);
        }
    };

    const validateForm = () => {
        return (
            imovelData.titulo &&
            imovelData.valor_pretendido &&
            imovelData.cidade &&
            imovelData.estado &&
            imovelData.imagem
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <LoadingSpinner isLoading={loading} />
            <div className="container flex flex-col justify-center items-center xl:w-5/6">
                <div className="flex flex-col gap-4 self-start w-full">
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="titulo"
                        value={imovelData.titulo}
                        onChange={handleChange}
                        placeholder="Título"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="number"
                        name="area_construida"
                        value={imovelData.area_construida}
                        onChange={handleChange}
                        placeholder="Área Construída"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="number"
                        name="area_util"
                        value={imovelData.area_util}
                        onChange={handleChange}
                        placeholder="Área Útil"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="motivo_da_venda"
                        value={imovelData.motivo_da_venda}
                        onChange={handleChange}
                        placeholder="Motivo da Venda"
                    />
                    <NumericFormat
                        className="p-1 rounded-lg shadow-lg"
                        name="valor_pretendido"
                        value={imovelData.valor_pretendido}
                        onValueChange={(values) =>
                            handleChange({
                                target: { name: 'valor_pretendido', value: values.floatValue },
                            })
                        }
                        placeholder="Valor Pretendido"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        isnumericstring="true"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="condicoes"
                        value={imovelData.condicoes}
                        onChange={handleChange}
                        placeholder="Condições"
                    />
                    <textarea
                        className="p-1 rounded-lg shadow-lg"
                        name="descricao"
                        value={imovelData.descricao}
                        onChange={handleChange}
                        placeholder="Descrição"
                        rows={4}
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="estado"
                        value={imovelData.estado}
                        onChange={handleChange}
                        placeholder="Estado"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="cidade"
                        value={imovelData.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="bairro"
                        value={imovelData.bairro}
                        onChange={handleChange}
                        placeholder="Bairro"
                    />
                    <div className="flex p-3 gap-10 text-lg">
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aceita_permuta"
                                checked={imovelData.aceita_permuta}
                                onChange={handleChange}
                            />
                            <span className="p-2">Aceita Permuta</span>
                        </label>
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="tem_divida"
                                checked={imovelData.tem_divida}
                                onChange={handleChange}
                            />
                            <span className="p-2">Tem Dívida</span>
                        </label>
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aluguel"
                                checked={imovelData.aluguel}
                                onChange={handleChange}
                            />
                            <span className="p-2">Aluguel</span>
                        </label>
                    </div>
                    <div>
                        <p className='text-xl text-red-800'>Imagem Principal:</p>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {imovelData.imagem && (
                            <Image src={typeof imovelData.imagem === 'string' ? imovelData.imagem : URL.createObjectURL(imovelData.imagem)} alt="Imagem Principal" width={200} height={200} />
                        )}
                    </div>
                    <div className='grid-cols-12 grid w-full'>
                        <p className='text-xl text-red-800 col-span-12'>Imagens Adicionais:</p>
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className='p-1 xl:col-span-4 lg:col-span-6 col-span-12'>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => updateDetailsImage(index, e.target.files[0])}
                                />
                                {imovelData.details_images[index] && (
                                    <div className='flex justify-center flex-col w-fit'>
                                        <Image
                                            src={typeof imovelData.details_images[index] === 'string' ? imovelData.details_images[index] : URL.createObjectURL(imovelData.details_images[index])}
                                            alt={`Imagem ${index + 1}`}
                                            width={200}
                                            height={200}
                                        />
                                        <button type="button"
                                            className="bg-red-700 rounded-lg w-2/4 self-center m-1 text-gray-200 hover:cursor-pointer hover:scale-105 hover:bg-red-800"
                                            onClick={() => handleRemoveDetailsImage(index)}>
                                            Remover
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700"
                    disabled={loading}
                >
                    {item ? 'Atualizar' : 'Criar'} Imóvel
                </button>
            </div>
        </form >
    );
};

export default ImoveisCRUD;