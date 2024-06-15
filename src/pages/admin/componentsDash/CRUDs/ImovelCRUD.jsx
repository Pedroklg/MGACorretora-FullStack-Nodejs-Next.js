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
            setLoading(true);
            // Simulate asynchronous data loading
            setTimeout(() => {
                setImovelData(item);
                setLoading(false);
            }, 500); // Adjust timeout as per your API response time or loading requirements
        }
    }, [item]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (unsavedChanges) {
                const message = 'Você tem mudanças não salvas. Tem certeza que deseja sair?';
                event.returnValue = message; // Standard for most browsers
                return message; // For older browsers
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

            setUnsavedChanges(false);
            setSavedOrUpdated(true);
            setImovelData(initialImovelData);
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
            showErrorToast('Preencha todos os campos obrigatórios: Título, Valor Pretendido, Cidade, Estado, Categoria e Imagem');
        }
    };

    useEffect(() => {
        if (savedOrUpdated) {
            router.push('/admin/Dashboard');
        }
    }, [savedOrUpdated]);

    const validateForm = () => {
        return imovelData.titulo &&
            imovelData.valor_pretendido &&
            imovelData.cidade &&
            imovelData.estado &&
            imovelData.imagem;
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
