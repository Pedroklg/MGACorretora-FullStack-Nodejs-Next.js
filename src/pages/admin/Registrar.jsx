import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EmpresaCRUD from './componentsDash/CRUDs/EmpresaCRUD';
import ImovelCRUD from './componentsDash/CRUDs/ImovelCRUD';
import ProgressBar from '../../components/animations/ProgressBar';
import Nav from './componentsDash/Nav';
import { protectRoute } from '../api/utils/sessionProtection';
import { showErrorToast } from '../../components/animations/toastService';

const Registrar = () => {
    const router = useRouter();
    const { id } = router.query;
    const [itemToEdit, setItemToEdit] = useState(null);
    const [currentCRUD, setCurrentCRUD] = useState('Empresa');
    const [loading, setLoading] = useState(false);

    const fetchItem = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/empresasImoveis?id=${id}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar item.');
            }
            const data = await response.json();
            setItemToEdit(data);
            setCurrentCRUD(data.tipo);
            setLoading(false);
        } catch (error) {
            console.error('Erro buscando item:', error);
            showErrorToast('Erro buscando item.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchItem(id);
        }
    }, [id]);

    const handleTipoChange = (tipo) => {
        setCurrentCRUD(tipo);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen overflow-auto">
            <Nav className="flex-shrink-0 lg:flex-grow-0" />
            <div className="flex-grow h-full">
                <ProgressBar loading={loading} />
                <div className="p-5 md:p-8 flex flex-col gap-8">
                    <div className="flex items-center justify-start shadow-lg rounded-lg flex-col md:flex-row">
                        <h1 className="text-3xl font-bold p-5">Registrar</h1>
                        <div className="md:ml-10">
                            <button onClick={() => handleTipoChange('Empresa')} className={`p-2 m-4 ${currentCRUD === 'Empresa' ? 'bg-red-800' : 'bg-red-700'} hover:bg-red-800 rounded-xl text-xl font-bold text-gray-200 shadow-xl`}>
                                Empresa
                            </button>
                            <button onClick={() => handleTipoChange('Imovel')} className={`p-2 m-4 ${currentCRUD === 'Imovel' ? 'bg-red-800' : 'bg-red-700'} hover:bg-red-800 rounded-xl text-xl font-bold text-gray-200 shadow-xl`}>
                                Imóvel
                            </button>
                        </div>
                    </div>

                    {currentCRUD === 'Empresa' ? (
                        <EmpresaCRUD item={itemToEdit && itemToEdit.tipo === 'Empresa' ? itemToEdit.item : null} />
                    ) : (
                        <ImovelCRUD item={itemToEdit && itemToEdit.tipo === 'Imovel' ? itemToEdit.item : null} />
                    )}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default Registrar;
