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
    const [removedImages, setRemovedImages] = useState([]);
    const [comodoName, setComodoName] = useState('');
    const [comodoQuantidade, setComodoQuantidade] = useState('');
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
        comodos: [],
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
                comodos: item.comodos || []
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
        setImovelData(prevData => ({ ...prevData, imagem: file }));
        setUnsavedChanges(true);
    };

    const handleUpdateDetailsImage = (index, file) => {
        const updatedImages = [...imovelData.details_images];
        updatedImages[index] = file;
        setImovelData(prevData => ({ ...prevData, details_images: updatedImages }));
        setUnsavedChanges(true);
    };

    const handleRemoveDetailsImage = (index) => {
        const updatedImages = [...imovelData.details_images];
        if (updatedImages[index]) {
            const image = updatedImages[index];
            const imageUrl = typeof image === 'string' ? image : (image instanceof Blob || image instanceof File) ? URL.createObjectURL(image) : null;
            if (imageUrl) {
                setRemovedImages(prev => [...prev, imageUrl]);
            }
        }
        updatedImages[index] = null;
        setImovelData(prevData => ({ ...prevData, details_images: updatedImages }));
        setUnsavedChanges(true);
    };

    const handleAddComodo = () => {
        if (comodoName && comodoQuantidade) {
            const newComodo = { nome: comodoName, quantidade: comodoQuantidade };
            setImovelData(prevData => ({ ...prevData, comodos: [...prevData.comodos, newComodo] }));
            setComodoName('');
            setComodoQuantidade('');
            setUnsavedChanges(true);
        } else {
            showErrorToast('Preencha todos os campos do cômodo.');
        }
    };

    const handleRemoveComodo = (index) => {
        const updatedComodos = [...imovelData.comodos];
        updatedComodos.splice(index, 1); // Remove comodo at index
        setImovelData(prevData => ({ ...prevData, comodos: updatedComodos }));
        setUnsavedChanges(true);
    };

    const handleEditComodo = (index, newName, newQuantidade) => {
        const updatedComodos = [...imovelData.comodos];
        updatedComodos[index] = { nome: newName, quantidade: newQuantidade };
        setImovelData(prevData => ({ ...prevData, comodos: updatedComodos }));
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
                } else if (key === 'comodos') {
                    formData.append('comodos', JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            formData.append('removed_images', JSON.stringify(removedImages));

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
            setRemovedImages([]); // Clear removed images after successful operation
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
                <div className="flex flex-col self-start w-full">
                    <label className="pt-5 p-1 text-red-900">Título</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="titulo"
                        value={imovelData.titulo}
                        onChange={handleChange}
                        placeholder="Título"
                    />
                    <label className="pt-5 p-1 text-red-900">Motivo da venda</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="motivo_da_venda"
                        value={imovelData.motivo_da_venda}
                        onChange={handleChange}
                        placeholder="Motivo da venda"
                    />
                    <label className="pt-5 p-1 text-red-900">Valor Pretendido</label>
                    <NumericFormat
                        className="p-1 rounded-lg shadow-lg"
                        name="valor_pretendido"
                        value={imovelData.valor_pretendido}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={'R$ '}
                        allowNegative={false}
                        onValueChange={(values) => {
                            const { value } = values;
                            setImovelData(prevData => ({ ...prevData, valor_pretendido: value }));
                            setUnsavedChanges(true);
                        }}
                        placeholder="Valor Pretendido"
                    />
                    <label className="pt-5 p-1 text-red-900">Área construída</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="area_construida"
                        value={imovelData.area_construida}
                        onChange={handleChange}
                        placeholder="Área construída"
                    />
                    <label className="pt-5 p-1 text-red-900">Área útil</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="area_util"
                        value={imovelData.area_util}
                        onChange={handleChange}
                        placeholder="Área útil"
                    />
                    <label className="pt-5 p-1 text-red-900">Condições</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="condicoes"
                        value={imovelData.condicoes}
                        onChange={handleChange}
                        placeholder="Condições"
                    />
                    <label className="pt-5 p-1 text-red-900">Descrição</label>
                    <textarea
                        className="p-1 rounded-lg shadow-lg"
                        name="descricao"
                        value={imovelData.descricao}
                        onChange={handleChange}
                        placeholder="Descrição"
                    />
                    <label className="pt-5 p-1 text-red-900">Estado</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="estado"
                        value={imovelData.estado}
                        onChange={handleChange}
                        placeholder="Estado"
                    />
                    <label className="pt-5 p-1 text-red-900">Cidade</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="cidade"
                        value={imovelData.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                    />
                    <label className="pt-5 p-1 text-red-900">Bairro</label>
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="bairro"
                        value={imovelData.bairro}
                        onChange={handleChange}
                        placeholder="Bairro"
                    />
                    <div className='pt-5 p-1'>
                        <label className="text-red-900">Cômodos</label>
                        {imovelData.comodos.map((comodo, index) => (
                            <div key={index} className="p-2 border border-gray-300 rounded mb-2 flex justify-between items-center">
                                <input
                                    className="p-1 rounded-lg shadow-lg"
                                    type="text"
                                    value={comodo.nome}
                                    onChange={(e) => handleEditComodo(index, e.target.value, comodo.quantidade)}
                                    placeholder="Nome do Cômodo"
                                />
                                <input
                                    className="p-1 rounded-lg shadow-lg ml-2"
                                    type="text"
                                    value={comodo.quantidade}
                                    onChange={(e) => handleEditComodo(index, comodo.nome, e.target.value)}
                                    placeholder="Quantidade de Cômodos"
                                />
                                <button type="button" className="p-1 text-red-500" onClick={() => handleRemoveComodo(index)}>
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            className="p-1 rounded-lg shadow-lg"
                            type="text"
                            name="comodoName"
                            value={comodoName}
                            onChange={(e) => setComodoName(e.target.value)}
                            placeholder="Nome do Cômodo"
                        />
                        <input
                            className="p-1 rounded-lg shadow-lg ml-2"
                            type="text"
                            name="comodoQuantidade"
                            value={comodoQuantidade}
                            onChange={(e) => setComodoQuantidade(e.target.value)}
                            placeholder="Quantidade de Cômodos"
                        />
                        <button type="button" className="bg-green-600 text-white py-1 px-1 rounded-lg shadow-lg hover:bg-green-700 ml-3" onClick={handleAddComodo}>
                            Adicionar Cômodo
                        </button>
                    </div>
                    <div className="flex p-3 gap-10 text-lg">
                        <div className="py-4">
                            <label className="p-1 text-red-900">Aluguel</label>
                            <input
                                className="mx-2"
                                type="checkbox"
                                name="aluguel"
                                checked={imovelData.aluguel}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="py-4">
                            <label className="p-1 text-red-900">Aceita Permuta</label>
                            <input
                                className="mx-2"
                                type="checkbox"
                                name="aceita_permuta"
                                checked={imovelData.aceita_permuta}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="py-4">
                            <label className="p-1 text-red-900">Tem Dívida</label>
                            <input
                                className="mx-2"
                                type="checkbox"
                                name="tem_divida"
                                checked={imovelData.tem_divida}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <label className='text-lg text-red-800 mt-4'>Imagem Principal(800x600px):</label>
                    <div className='p-2'>
                        <input type="file" accept="image/*" onChange={handleImageChange} className='p-2' />
                        {imovelData.imagem && (
                            <Image src={typeof imovelData.imagem === 'string' ? imovelData.imagem : URL.createObjectURL(imovelData.imagem)} alt="Imagem Principal" width={200} height={200} />
                        )}
                    </div>
                    <div className='grid-cols-12 grid w-full p-2'>
                        <label className='text-lg text-red-800 col-span-12'>Imagens Adicionais(800x600px):</label>
                        {[...Array(9)].map((_, index) => (
                            <div key={index} className='p-2 xl:col-span-4 lg:col-span-6 col-span-12'>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUpdateDetailsImage(index, e.target.files[0])}
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
            <div className="flex justify-center mt-5">
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700"
                    disabled={loading}
                >
                    {item ? 'Atualizar' : 'Criar'} imovel
                </button>
            </div>
        </form >
    );
};

export default ImoveisCRUD;