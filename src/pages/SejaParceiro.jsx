import Header from '../components/Header';
import Footer from '../components/Footer';
import { IconPhone, IconEmail } from '../components/Icons';
import ContactForm from '../components/ContactForm';
import Head from 'next/head';

function SejaParceiro() {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Seja Parceiro - MGA Corretora</title>
                <meta name="description" content="Se torne um parceiro da MGA Corretora. Junte-se a nós para alcançar novas oportunidades no mercado de empresas e imóveis." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center">
                <div className='md:w-8/12 w-full p-5 md:p-10 lg:p-15'>
                    <div className='w-full flex items-center'>
                        <div className="flex-grow h-px bg-red-700 mr-4 rounded-md"></div>
                        <h1 className="text-3xl font-bold text-red-700">
                            Seja Parceiro!
                        </h1>
                        <div className="flex-grow h-px bg-red-700 ml-4 rounded-md"></div>
                    </div>
                    <p className='text-lg p-2'>
                        Você pode ser sócio da MGA Corretora, instalando um escritório em sua Cidade. Conheça nosso plano de expansão, entre em Contato!
                    </p>
                </div>
                <div className='sm:w-10/12 w-full sm:p-5 p-3'>
                    <ContactForm />
                </div>
                <div className="flex justify-center items-center p-5 sm:flex-row flex-col">
                    <div className="flex justify-center items-center p-3 md:p-10 flex-col">
                        <p className='text-5xl p-2'>
                            Ponta Grossa
                        </p>
                        <a target="_blank" href="tel:42 99909-4741" className='text-3xl p-2 hover:text-red-800'>
                            <div className='flex justify-center items-center gap-3 hover:scale-105 duration-150'>
                                <span>42 99909-4741</span>
                                {IconPhone}
                            </div>
                        </a>
                        <p>Entre em contato por telefone!</p>
                    </div>
                    <div className='border-l-2 border-red-800 h-0 sm:h-48 mx-5'></div>
                    <div className="flex justify-center items-center p-3 md:p-10 flex-col">
                        <p className='text-5xl p-2'>
                            Curitiba
                        </p>
                        <a target="_blank" href="tel:41 99540-0788" className='text-3xl p-2 hover:text-red-800'>
                            <div className='flex justify-center items-center gap-3 hover:scale-105 duration-150'>
                                <span>41 99540-0788</span>
                                {IconPhone}
                            </div>
                        </a>
                        <p>Entre em contato por telefone!</p>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-col md:mt-5 mb-5">
                    <div className="p-1 hover:text-red-800 flex flex-col flex-wrap gap-2 items-center justify-center">
                        <span className='text-2xl p-2 font-semibold'>Ou entre em contato pelo e-mail</span>
                        <a href="mailto:contato@mgacorretora.com.br">
                            <div className='flex p-2 gap-2 text-xl hover:scale-105 duration-150'>
                                {IconEmail}
                                <span>contato@mgacorretora.com.br</span>
                            </div>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>

    )
}

export default SejaParceiro;