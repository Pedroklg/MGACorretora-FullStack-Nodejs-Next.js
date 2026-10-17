import { useState, useEffect } from 'react';
import LoadingSpinner from './animations/LoadingSpinner';
import { showSuccessToast, showErrorToast } from './animations/toastService';
import { HoneypotField, isRecaptchaConfigured, RecaptchaScript, useRecaptcha } from './Recaptcha';

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
        additionalInfo: '',
        website: ''
    }
    const [formData, setFormData] = useState(initialFormData);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const getRecaptchaToken = useRecaptcha();

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
            const recaptchaToken = await getRecaptchaToken('register');
            if (isRecaptchaConfigured && !recaptchaToken) {
                showErrorToast('Não foi possível validar o envio. Verifique sua conexão e tente novamente.');
                return;
            }
            const response = await fetch('/api/registerCompanyForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, recaptchaToken }),
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
            <RecaptchaScript />
            <LoadingSpinner isLoading={isLoading} />
            <h2 className='text-xl text-red-900 ml-3 font-semibold'>Cadastre sua Empresa</h2>
            <form className='w-full grid grid-cols-12 p-2 rounded-md items-stretch' onSubmit={handleSubmit}>
                <HoneypotField value={formData.website} onChange={handleChange} />
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-fullName">Nome Completo *</label>
                    <input id="cadastro-fullName"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-type">Empresa ou Imóvel *</label>
                    <input id="cadastro-type"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-mobile">Celular *</label>
                    <input id="cadastro-mobile"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-email">Email</label>
                    <input id="cadastro-email"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-companyType">Tipo de Empresa</label>
                    <input id="cadastro-companyType"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-state">Estado *</label>
                    <input id="cadastro-state"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-city">Cidade *</label>
                    <input id="cadastro-city"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-district">Bairro</label>
                    <input id="cadastro-district"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-number">Número</label>
                    <input id="cadastro-number"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-address">Endereço</label>
                    <input id="cadastro-address"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-phone">Telefone da empresa</label>
                    <input id="cadastro-phone"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-complement">Complemento</label>
                    <input id="cadastro-complement"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-description">Descrição *</label>
                    <textarea id="cadastro-description"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label htmlFor="cadastro-additionalInfo">Informações Adicionais</label>
                    <textarea id="cadastro-additionalInfo"
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
