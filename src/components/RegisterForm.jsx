import { useState, useEffect } from 'react';
import LoadingSpinner from './animations/LoadingSpinner';
import { showSuccessToast, showErrorToast } from './animations/toastService';

export default function RegisterForm() {
    const initialFormData = {
        fullName: '',
        type: '',
        mobile: '',
        email: '',
        companyType: '',
        state: '',
        city: '',
        district: '',
        number: '',
        address: '',
        phone: '',
        complement: '',
        description: '',
        additionalInfo: ''
    }
    const [formData, setFormData] = useState(initialFormData);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (unsavedChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [unsavedChanges]);

    const handleBeforeUnload = (event) => {
        const message = 'Você tem mudanças não salvas. Tem certeza que deseja sair?';
        event.preventDefault();
        event.returnValue = message;
        return message;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setUnsavedChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, mobile, email, type, state, city, description } = formData;

        if (!fullName || (!email && !mobile) || !type || !state || !city ||!description) {
            showErrorToast(`Por favor preencha os campos: ${!fullName ? 'Nome Completo' : ''} ${!email && !mobile ? 'Celular ou Email' : ''} ${!type ? 'Empresa ou Imóvel' : ''} ${!state ? 'Estado' : ''} ${!city ? 'Cidade' : ''} ${!description ? 'Descrição' : ''}`);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/registerCompanyForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                showSuccessToast('Cadastro enviado com sucesso!');
                setFormData(initialFormData);
            } else {
                showErrorToast('Falha ao enviar o cadastro.');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorToast('Falha ao enviar o cadastro.');
        } finally {
            setUnsavedChanges(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="col-span-12 shadow-md p-2 rounded-md">
            <LoadingSpinner isLoading={isLoading} />
            <h2 className='text-xl text-red-900 ml-3 font-semibold'>Cadastre sua Empresa</h2>
            <form className='w-full grid grid-cols-12 p-2 rounded-md items-stretch' onSubmit={handleSubmit}>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Nome Completo *</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Empresa ou Imóvel *</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Celular *</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Email</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Tipo de Empresa</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Estado *</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Cidade *</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Bairro</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Número</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Endereço</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Telefone da empresa</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label>Complemento</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label>Descrição *</label>
                    <textarea
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label>Informações Adicionais</label>
                    <textarea
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                    />
                </div>
                <button
                    className='bg-red-900 text-white p-2 rounded-md w-30 hover:bg-red-700 self-center col-span-12 md:col-span-2 md:col-start-6 md:col-end-8'
                    type="submit">
                    Enviar
                </button>
            </form>
        </div>
    );
}
