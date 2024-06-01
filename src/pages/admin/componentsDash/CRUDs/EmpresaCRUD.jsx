import React, { useState, useEffect } from 'react';

const EmpresasCRUD = ({ item }) => {
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
            setEmpresaData(item);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresaData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEmpresaData(prevData => ({ ...prevData, [name]: checked }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEmpresaData(prevData => ({ ...prevData, imagem: file }));
    };

    const createOrUpdateEmpresa = async () => {
        try {
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

            console.log('Empresa created or updated successfully');
            alert('Empresa criada ou atualizada com sucesso!');
            // Reset form state to initial values
            setEmpresaData(initialEmpresaData);
        } catch (error) {
            console.error('Error creating or updating empresa:', error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createOrUpdateEmpresa();
    };

    return ( 
        <form onSubmit={handleSubmit}>
            <div className="container flex flex-col justify-center items-center w-5/6">
                <div className="flex flex-col gap-4 self-start w-full">
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="titulo" value={empresaData.titulo} onChange={handleChange} placeholder="Título" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="number" name="tempo_de_mercado" value={empresaData.tempo_de_mercado} onChange={handleChange} placeholder="Tempo de Mercado" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="number" name="funcionarios" value={empresaData.funcionarios} onChange={handleChange} placeholder="Funcionários" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="motivo_da_venda" value={empresaData.motivo_da_venda} onChange={handleChange} placeholder="Motivo da Venda" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="number" name="valor_pretendido" value={empresaData.valor_pretendido} onChange={handleChange}
                        placeholder="Valor Pretendido"
                    />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="condicoes" value={empresaData.condicoes} onChange={handleChange} placeholder="Condições" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="sobre_o_imovel" value={empresaData.sobre_o_imovel} onChange={handleChange} placeholder="Sobre a Empresa" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="endereco" value={empresaData.endereco} onChange={handleChange} placeholder="Endereço" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="estado" value={empresaData.estado} onChange={handleChange} placeholder="Estado" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="cidade" value={empresaData.cidade} onChange={handleChange} placeholder="Cidade" />
                    <input className="p-1 rounded-lg shadow-lg"
                        type="text" name="categoria" value={empresaData.categoria} onChange={handleChange} placeholder="Categoria" />
                    <div className='flex p-3 gap-10 text-lg'>
                        <label>
                            <input className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="aceita_permuta"
                                checked={empresaData.aceita_permuta}
                                onChange={handleCheckboxChange}
                            />
                            <span className="p-2">Aceita Permuta</span>
                        </label>
                        <label>
                            <input className="p-1 rounded-lg shadow-lg"
                                type="checkbox"
                                name="tem_divida"
                                checked={empresaData.tem_divida}
                                onChange={handleCheckboxChange}
                            />
                            <span className="p-2">Tem Dívida</span>
                        </label>
                    </div>
                    {empresaData.imagem ? <img src={empresaData.imagem} alt="Selected Image" /> : <span>Selecione uma imagem:</span>}
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

export default EmpresasCRUD;
