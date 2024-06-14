import { useState, useEffect } from 'react';
import LoadingSpinner from './animations/LoadingSpinner';
import { showSuccessToast, showErrorToast } from './animations/toastService';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (unsavedChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formData]);

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
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showErrorToast('Por favor, preencha todos os campos.');
            return;
        }
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                showSuccessToast('Email enviado com sucesso!');
                setFormData({ name: '', email: '', subject: '', message: '' });
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
            <LoadingSpinner isLoading={isLoading} />
            <h2 className='text-xl text-red-900 ml-3 font-semibold'>Entre em contato por E-mail</h2>
            <form className='w-full flex flex-col p-2 rounded-md items-stretch' 
                onSubmit={handleSubmit}>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label>Nome:</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label>Email para contato:</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label>Assunto:</label>
                    <input
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-span-12 p-1 md:p-2 text-lg'>
                    <label>Mensagem:</label>
                    <textarea
                        className='shadow-md p-1 md:p-2 rounded-md w-full'
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button 
                    className='bg-red-900 text-white p-2 rounded-md w-30 hover:bg-red-700 self-center'
                    type="submit">
                    Enviar
                </button>
            </form>
        </div>
    );
}
