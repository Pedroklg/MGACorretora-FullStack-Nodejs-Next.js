import Header from '../components/Header';
import Footer from '../components/Footer';
import { IconPhone } from '../components/Icones';

function Contato() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header></Header>
            <main className="flex-grow flex items-center justify-center">
                <div className="flex justify-center items-center p-5 flex-row h-full">
                    <div className="flex justify-center items-center p-10 flex-col">
                        <div className='text-5xl p-2'>
                            Ponta Grossa
                        </div>
                        <a target="_blank" href="tel:42 99909-4741"
                            className='text-3xl p-2 hover:text-red-800'>
                            <div className='flex justify-center items-center gap-3'>
                                <span>42 99909-4741</span>
                                {IconPhone}
                            </div>
                        </a>
                        <p> Ligue e agende a sua visita! </p>
                    </div>
                    <div className='border-l-2 border-red-800 h-48 mx-5'></div>
                    <div className="flex justify-center items-center p-10 flex-col">
                        <div className='text-5xl p-2'>
                            Curitiba
                        </div>
                        <a target="_blank" href="tel:41 99540-0788"
                            className='text-3xl p-2 hover:text-red-800'>
                            <div className='flex justify-center items-center gap-3'>
                                <span>41 99540-0788</span>
                                {IconPhone}
                            </div>
                        </a>
                        <p> Ligue e agende a sua visita! </p>
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </div>

    )
}

export default Contato;