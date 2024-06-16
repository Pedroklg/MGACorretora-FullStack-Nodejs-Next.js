import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../../components/animations/LoadingSpinner';
import { NumericFormat } from 'react-number-format';
import { showErrorToast, showSuccessToast } from '../../../../components/animations/toastService';
import { useRouter } from 'next/router';
import Image from 'next/image';

const EmpresasCRUD = ({ item }) => {
    const [loading, setLoading] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [savedOrUpdated, setSavedOrUpdated] = useState(false);
    const router = useRouter();

    const initialEmpresaData = {
        titulo: '',
        tempo_de_mercado: '',
        funcionarios: '',
        motivo_da_venda: '',
        valor_pretendido: '',
        condicoes: '',
        descricao: '',
        funcionamento: '',
        sobre_imovel: '',
        bairro: '',
        aceita_permuta: false,
        tem_divida: false,
        estado: '',
        cidade: '',
        categoria: '',
        imagem: null,
        details_images: Array(6).fill(null),
    };

    const [empresaData, setEmpresaData] = useState(initialEmpresaData);

    useEffect(() => {
        if (item) {
            setLoading(true);
            setEmpresaData({
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
        setEmpresaData(prevData => ({ ...prevData, [name]: newValue }));
        if (!loading) {
            setUnsavedChanges(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEmpresaData(prevData => ({ ...prevData, imagem: file }));
        setUnsavedChanges(true);
    };

    const updateDetailsImage = (index, file) => {
        const updatedImages = [...empresaData.details_images];
        updatedImages[index] = file;
        setEmpresaData(prevData => ({ ...prevData, details_images: updatedImages }));
        setUnsavedChanges(true);
    };

    const handleRemoveDetailsImage = (index) => {
        const updatedImages = [...empresaData.details_images];
        updatedImages[index] = null;
        setEmpresaData(prevData => ({ ...prevData, details_images: updatedImages }));
        setUnsavedChanges(true);
    };

    const createOrUpdateEmpresa = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(empresaData).forEach(([key, value]) => {
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

            const endpoint = item ? `/api/empresas?id=${item.id}` : '/api/empresas';
            const method = item ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao ${item ? 'atualizar' : 'criar'} empresa`);
            }

            setUnsavedChanges(false);
            setSavedOrUpdated(true);
            setEmpresaData(initialEmpresaData);
            showSuccessToast(`Empresa ${item ? 'atualizada' : 'criada'} com sucesso!`);
        } catch (error) {
            console.error(`Erro ao ${item ? 'atualizar' : 'criar'} empresa:`, error.message);
            showErrorToast(`Erro ao ${item ? 'atualizar' : 'criar'} empresa`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            await createOrUpdateEmpresa();
        } else {
            showErrorToast(`Preencha todos os campos: ${!empresaData.titulo ? 'Título' : ''}, ${!empresaData.valor_pretendido ? 'Valor Pretendido' : ''},
                ${!empresaData.cidade ? 'Cidade' : ''}, ${!empresaData.estado ? 'Estado' : ''}, ${!empresaData.categoria ? 'Categoria' : ''}, ${!empresaData.imagem ? 'Imagem' : ''}`);
        }
    };

    const validateForm = () => {
        return (
            empresaData.titulo &&
            empresaData.valor_pretendido &&
            empresaData.cidade &&
            empresaData.estado &&
            empresaData.categoria &&
            empresaData.imagem
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <LoadingSpinner isLoading={loading} />
            <div className="container flex flex-col justify-center items-center w-full md:w-5/6">
                <div className="flex flex-col gap-4 self-start w-full">
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="titulo"
                        value={empresaData.titulo}
                        onChange={handleChange}
                        placeholder="Título"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="number"
                        name="tempo_de_mercado"
                        value={empresaData.tempo_de_mercado}
                        onChange={handleChange}
                        placeholder="Tempo de Mercado"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="number"
                        name="funcionarios"
                        value={empresaData.funcionarios}
                        onChange={handleChange}
                        placeholder="Funcionários"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="motivo_da_venda"
                        value={empresaData.motivo_da_venda}
                        onChange={handleChange}
                        placeholder="Motivo da Venda"
                    />
                    <NumericFormat
                        className="p-1 rounded-lg shadow-lg"
                        name="valor_pretendido"
                        value={empresaData.valor_pretendido}
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
                        value={empresaData.condicoes}
                        onChange={handleChange}
                        placeholder="Condições"
                    />
                    <textarea
                        className="p-1 rounded-lg shadow-lg"
                        name="funcionamento"
                        value={empresaData.funcionamento}
                        onChange={handleChange}
                        placeholder="Horário de Funcionamento"
                        rows={3}
                    />
                    <textarea
                        className="p-1 rounded-lg shadow-lg"
                        name="sobre_imovel"
                        value={empresaData.sobre_imovel}
                        onChange={handleChange}
                        placeholder="Sobre o Imóvel"
                        rows={3}
                    />
                    <textarea
                        className="p-1 rounded-lg shadow-lg"
                        name="descricao"
                        value={empresaData.descricao}
                        onChange={handleChange}
                        placeholder="Descrição"
                        rows={4}
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="bairro"
                        value={empresaData.bairro}
                        onChange={handleChange}
                        placeholder="Bairro"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="estado"
                        value={empresaData.estado}
                        onChange={handleChange}
                        placeholder="Estado"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="cidade"
                        value={empresaData.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="categoria"
                        value={empresaData.categoria}
                        onChange={handleChange}
                        placeholder="Categoria"
                    />
                    <div className="flex p-3 gap-10 text-lg">
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aceita_permuta"
                                checked={empresaData.aceita_permuta}
                                onChange={handleChange}
                            />
                            <span className="p-2">Aceita Permuta</span>
                        </label>
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="tem_divida"
                                checked={empresaData.tem_divida}
                                onChange={handleChange}
                            />
                            <span className="p-2">Tem Dívida</span>
                        </label>
                    </div>
                    <div>
                        <p className='text-xl text-red-800'>Imagem Principal:</p>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {empresaData.imagem && (
                            <Image src={typeof empresaData.imagem === 'string' ? empresaData.imagem : URL.createObjectURL(empresaData.imagem)} alt="Imagem Principal" width={200} height={200} />
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
                                {empresaData.details_images[index] && (
                                    <div className='flex justify-center flex-col w-fit'>
                                        <Image
                                            src={typeof empresaData.details_images[index] === 'string' ? empresaData.details_images[index] : URL.createObjectURL(empresaData.details_images[index])}
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
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700"
                        disabled={loading}
                    >
                        {item ? 'Atualizar' : 'Criar'} Empresa
                    </button>
                </div>
            </div>
        </form>
    );
}

export default EmpresasCRUD;