import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../../../../components/animations/LoadingSpinner';
import { NumericFormat } from 'react-number-format';
import { showErrorToast, showSuccessToast } from '../../../../components/animations/toastService';

const ImoveisCRUD = ({ item, onSubmitSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
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
        sobre_o_imovel: '',
        estado: '',
        cidade: '',
        endereco: '',
        aluguel: false,
    };

    const [imovelData, setImovelData] = useState(initialImovelData);

    // Set initial state based on the provided item when component mounts
    useEffect(() => {
        if (item) {
            setImovelData(item);
        }
    }, [item]);

    // Check if any field is filled to trigger unsaved changes alert
    useEffect(() => {
        if (unsavedChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [imovelData]);

    const handleBeforeUnload = (event) => {
        const message = 'Você tem mudanças não salvas. Tem certeza que deseja sair?';
        event.preventDefault();
        event.returnValue = message;
        return message;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setImovelData(prevData => ({ ...prevData, [name]: newValue }));
        setUnsavedChanges(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        setImovelData(prevData => ({ ...prevData, imagem: file }));
        setUnsavedChanges(true);
    };

    const createOrUpdateImovel = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(imovelData).forEach(([key, value]) => {
                formData.append(key, value);
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

            setLoading(false);
            showSuccessToast(`Imovel ${item ? 'atualizado' : 'criado'} com sucesso!`);
            // Reset form state to initial values and clear unsaved changes flag
            setImovelData(initialImovelData);
            setUnsavedChanges(false);

            onSubmitSuccess();
        } catch (error) {
            console.error(`Falha ao ${item ? 'atualizar' : 'criar'} imovel`, error.message);
            setLoading(false);
            showErrorToast(`Falha ao ${item ? 'atualizar' : 'criar'} imovel`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createOrUpdateImovel();
        } else {
            showErrorToast('Preencha todos os campos obrigatórios: Título, Valor Pretendido, Cidade, Estado');
        }
    };

    const validateForm = () => {
        return imovelData.titulo &&
            imovelData.valor_pretendido &&
            imovelData.cidade &&
            imovelData.estado;
    };

    return (
        <form onSubmit={handleSubmit}>
            <LoadingSpinner isLoading={loading} />
            <div className="conteiner flex flex-col justify-center items-center md:w-5/6">
                <div className="flex flex-col gap-4 self-start w-full">
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="titulo" value={imovelData.titulo} onChange={handleChange} placeholder="Titulo" required />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="number" name="area_construida" value={imovelData.area_construida} onChange={handleChange} placeholder="Área Construída" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="number" name="area_util" value={imovelData.area_util} onChange={handleChange} placeholder="Área Útil" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="motivo_da_venda" value={imovelData.motivo_da_venda} onChange={handleChange} placeholder="Motivo da Venda" />
                    <NumericFormat
                        className="p-1 rounded-lg shadow-lg"
                        name="valor_pretendido"
                        value={imovelData.valor_pretendido}
                        onValueChange={(values) => handleChange({ target: { name: 'valor_pretendido', value: values.floatValue } })}
                        placeholder="Valor Pretendido"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        isnumericstring="true"
                        required
                    />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="condicoes" value={imovelData.condicoes} onChange={handleChange} placeholder="Condições" />
                    <textarea
                        className="p-1 rounded-lg shadow-lg"
                        name="sobre_o_imovel"
                        value={imovelData.sobre_o_imovel}
                        onChange={handleChange}
                        placeholder="Sobre o Imóvel"
                        rows={4}
                    />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="estado" value={imovelData.estado} onChange={handleChange} placeholder="Estado" required />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="cidade" value={imovelData.cidade} onChange={handleChange} placeholder="Cidade" required />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="endereco" value={imovelData.endereco} onChange={handleChange} placeholder="Endereço" />
                    <div className='flex p-3 gap-10 text-lg'>
                        <label>
                            <input className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aceita_permuta"
                                checked={imovelData.aceita_permuta}
                                onChange={handleChange}
                            />
                            <span className="p-2">Aceita Permuta</span>
                        </label>
                        <label>
                            <input className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="tem_divida"
                                checked={imovelData.tem_divida}
                                onChange={handleChange}
                            />
                            <span className="p-2">Tem Dívida</span>
                        </label>
                        <label>
                            <input className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aluguel"
                                checked={imovelData.aluguel}
                                onChange={handleChange}
                            />
                            <span className="p-2">Aluguel</span>
                        </label>
                    </div>
                    {imovelData.imagem ?
                        <Image src={imovelData.imagem} alt="Selected Image" width={400} height={200} />
                        :
                        <span>Selecione uma imagem:</span>}
                    <input className="p-1 rounded-lg"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <button className="p-2 m-5 bg-green-600 hover:bg-green-700 rounded-xl text-xl font-bold text-gray-200 shadow-xl" type="submit">Salvar</button>
            </div>
        </form>
    );
}

export default ImoveisCRUD;
