import React, { useState, useEffect, useContext } from 'react';
import EmpresaCRUD from './componentsDash/CRUDs/EmpresaCRUD';
import ImovelCRUD from './componentsDash/CRUDs/ImovelCRUD';
import { ItemContext } from '../../context/ItemContext'; // Adjust path if necessary
import ProgressBar from '../../components/animations/ProgressBar';

const Registrar = () => {
    const { itemToEdit, setItemToEdit } = useContext(ItemContext) || {}; // Access itemToEdit from context
    const [currentCRUD, setCurrentCRUD] = useState('Empresa'); // Default to 'Empresa'
    const [loading, setLoading] = useState(false);

    const fetchItem = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/empresasImoveis?id=${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch item');
            }
            const data = await response.json();
            setItemToEdit(data);
            setCurrentCRUD(data.tipo);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching item:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (itemToEdit && itemToEdit.id) {
            // Fetch item details only in edit mode
            fetchItem(itemToEdit.id);
        }
    }, [itemToEdit]);


    const handleTipoChange = (tipo) => {
        setCurrentCRUD(tipo);
    };

    return (
        <div className="h-fit min-h-svh w-svw overflow-scroll">
            <ProgressBar loading={loading}/>
            <div className="p-8 grid gap-8">
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
    );
};

export default Registrar;
