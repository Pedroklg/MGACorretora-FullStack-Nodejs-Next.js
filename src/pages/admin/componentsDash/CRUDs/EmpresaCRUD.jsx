import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProgressBar from '../../../../components/animations/ProgressBar';
import { NumericFormat } from 'react-number-format';

const EmpresasCRUD = ({ item, onSubmitSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const initialEmpresaData = {
        titulo: '',
        tempo_de_mercado: '',
        funcionarios: '',
        motivo_da_venda: '',
        valor_pretendido: '',
        condicoes: '',
        sobre_o_imovel: '',
        endereco: '',
        aceita_permuta: false,
        tem_divida: false,
        imagem: null,
        estado: '',
        cidade: '',
        categoria: '',
    };

    const [empresaData, setEmpresaData] = useState(initialEmpresaData);

    // Set initial state based on the provided item when component mounts
    useEffect(() => {
        if (item) {
            setLoading(true);
            setEmpresaData(item);
            setLoading(false);
        }
    }, [item]);

    // Check if any field is filled to trigger unsaved changes alert
    useEffect(() => {
        const isFieldFilled = Object.values(empresaData).some(value => !!value);
        if (isFieldFilled) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [empresaData]);

    const handleBeforeUnload = (event) => {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.preventDefault();
        event.returnValue = message;
        return message;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresaData(prevData => ({ ...prevData, [name]: value }));
        setUnsavedChanges(true);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEmpresaData(prevData => ({ ...prevData, [name]: checked }));
        setUnsavedChanges(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEmpresaData(prevData => ({ ...prevData, imagem: file }));
        setUnsavedChanges(true);
    };

    const createOrUpdateEmpresa = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(empresaData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Determine the API endpoint based on whether the item prop is provided
            const endpoint = item ? `/api/empresas?id=${item.id}` : '/api/empresas';

            // Determine the HTTP method based on whether the item prop is provided
            const method = item ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create or update empresa');
            }

            setLoading(false);
            alert('Empresa criada ou atualizada com sucesso!');
            // Reset form state to initial values and clear unsaved changes flag
            setEmpresaData(initialEmpresaData);
            setUnsavedChanges(false);
            
            onSubmitSuccess();
        } catch (error) {
            console.error('Error creating or updating empresa:', error.message);
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createOrUpdateEmpresa();
        } else {
            alert('Preencha todos os campos obrigatórios: Título, Valor Pretendido, Cidade, Estado, Categoria');
        }
    };

    const validateForm = () => {
        return (
            empresaData.titulo &&
            empresaData.valor_pretendido &&
            empresaData.cidade &&
            empresaData.estado &&
            empresaData.categoria
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <ProgressBar loading={loading} />
            <div className="container flex flex-col justify-center items-center w-full md:w-5/6">
                <div className="flex flex-col gap-4 self-start w-full">
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="titulo"
                        value={empresaData.titulo}
                        onChange={handleChange}
                        placeholder="Título"
                        required
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
                        isNumericString
                        required
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="condicoes"
                        value={empresaData.condicoes}
                        onChange={handleChange}
                        placeholder="Condições"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="sobre_o_imovel"
                        value={empresaData.sobre_o_imovel}
                        onChange={handleChange}
                        placeholder="Sobre a Empresa"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="endereco"
                        value={empresaData.endereco}
                        onChange={handleChange}
                        placeholder="Endereço"
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="estado"
                        value={empresaData.estado}
                        onChange={handleChange}
                        placeholder="Estado"
                        required
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="cidade"
                        value={empresaData.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                        required
                    />
                    <input
                        className="p-1 rounded-lg shadow-lg"
                        type="text"
                        name="categoria"
                        value={empresaData.categoria}
                        onChange={handleChange}
                        placeholder="Categoria"
                        required
                    />
                    <div className="flex p-3 gap-10 text-lg">
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aceita_permuta"
                                checked={empresaData.aceita_permuta}
                                onChange={handleCheckboxChange}
                            />
                            <span className="p-2">Aceita Permuta</span>
                        </label>
                        <label>
                            <input
                                className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="tem_divida"
                                checked={empresaData.tem_divida}
                                onChange={handleCheckboxChange}
                            />
                            <span className="p-2">Tem Dívida</span>
                        </label>
                    </div>
                    {empresaData.imagem ? (
                        <Image
                            src={empresaData.imagem}
                            alt="Selected Image"
                            width={400}
                            height={200}
                        />
                    ) : (
                        <span>Selecione uma imagem:</span>
                    )}
                    <input
                        className="p-1 rounded-lg"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <button className="p-2 m-5 bg-green-600 hover:bg-green-700 rounded-xl text-xl font-bold text-gray-200 shadow-xl" type="submit">
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default EmpresasCRUD;
