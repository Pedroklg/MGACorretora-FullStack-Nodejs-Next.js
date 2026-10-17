import { useState, useEffect } from 'react';
import LoadingSpinner from './animations/LoadingSpinner';
import { showSuccessToast, showErrorToast } from './animations/toastService';
import { HoneypotField, RecaptchaScript, useRecaptcha } from './Recaptcha';

export default function ContactForm({ defaultSubject = '' }) {
    const initialFormData = {
        name: '',
        email: '',
        subject: defaultSubject,
        phone: '',
        message: '',
        website: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const getRecaptchaToken = useRecaptcha();
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (unsavedChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formData, unsavedChanges]);

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
        if (!formData.name || (!formData.email && !formData.phone) || !formData.subject || !formData.message) {
            showErrorToast('Por favor, preencha os campos.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    page: window.location.pathname,
                    recaptchaToken: await getRecaptchaToken('contact'),
                }),
            });

            const result = await response.json();

            if (result.success) {
                showSuccessToast('Email enviado com sucesso!');
                setFormData(initialFormData);
            } else {
                showErrorToast('Falha ao enviar o email.');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorToast('Falha ao enviar o email.');
        } finally {
            setUnsavedChanges(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="col-span-12 shadow-md p-2 rounded-md">
            <RecaptchaScript />
            <LoadingSpinner isLoading={isLoading} />
            <h2 className='text-xl text-red-900 ml-3 font-semibold'>Entre em contato por E-mail</h2>
            <form className='w-full grid grid-cols-12 p-2 rounded-md items-stretch' 
                onSubmit={handleSubmit}>
                <HoneypotField value={formData.website} onChange={handleChange} />
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="contato-name">Nome:</label>
                    <input id="contato-name"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="contato-email">Email para contato:</label>
                    <input id="contato-email"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="email"
                        autoComplete="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="contato-subject">Assunto:</label>
                    <input id="contato-subject"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 md:col-span-6 p-1 md:p-2 text-lg'>
                    <label htmlFor="contato-phone">Telefone:</label>
                    <input id="contato-phone"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="tel"
                        autoComplete="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label htmlFor="contato-message">Mensagem:</label>
                    <textarea id="contato-message"
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
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
