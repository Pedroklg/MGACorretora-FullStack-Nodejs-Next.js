import Link from 'next/link';
import Image from 'next/image';
import { IconEmail, IconWhatsapp } from './Icons';

export default function Footer() {
    return (
        <footer className="h-fit md:pb-5" style={{ backgroundImage: "url(/footer-bg.png)" }}>
            <div className='flex flex-col md:flex-row text-xl font-bold md:gap-24 justify-center items-center h-fit'>
                <Link href="/" passHref legacyBehavior>
                    <div className="p-2 flex flex-col justify-center items-center hover:scale-105 duration-150 cursor-pointer">
                        <div>
                            <div className='hidden sm:block'>
                                <Image src="/logo.png" alt="MGA Corretora" width={150} height={150} />
                            </div>
                            <div className='block sm:hidden'>
                                <Image src="/logo_mobile.png" alt='MGA Corretora' width={300} height={200} />
                            </div>
                        </div>
                        <span className="text-lg text-red-900 font-medium mt-2 subpixel-antialiased hidden md:flex">CRECI J5087</span>
                    </div>
                </Link>
                <div className="md:mx-8 self-start pl-5">
                    <h4 className="p-2 text-2xl text-red-800">A MGA</h4>
                    <ul>
                        <li className="p-1 hover:text-red-800 hover:scale-105 duration-150 text-base">
                            <Link href="/QueroVender" passHref>
                                <span>Quero Vender</span>
                            </Link>
                        </li>
                        <li className="p-1 hover:text-red-800 hover:scale-105 duration-150 text-base">
                            <Link href="/SejaParceiro" passHref>
                                <span>Seja Parceiro</span>
                            </Link>
                        </li>
                        <li className="p-1 hover:text-red-800 hover:scale-105 duration-150 text-base">
                            <Link href="/Sobre" passHref>
                                <span>Sobre</span>
                            </Link>
                        </li>
                        <li className="p-1 hover:text-red-800 hover:scale-105 duration-150 text-base">
                            <Link href="/Contato" passHref>
                                <span>Fale Conosco</span>
                            </Link>
                        </li>
                        <li className="p-1 hover:text-red-800 hover:scale-105 duration-150 text-base">
                            <Link href="/PoliticasDePrivacidade" passHref>
                                <span>Políticas de Privacidade</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex ml-4 flex-col md:flex-row">
                    <div className="md:mx-16 md:flex-col">
                        <h4 className="p-2 text-2xl text-red-800">ONDE ESTAMOS?</h4>

                        <a href="tel:+5541995400788" className="p-1 hover:text-red-800 flex flex-wrap gap-2 justify-start items-center hover:scale-105 duration-150">
                            {IconWhatsapp}
                            Curitiba - PR |
                            41 99540-0788
                        </a>
                        <a href="tel:+5542999094741" className="p-1 hover:text-red-800 flex flex-wrap gap-2 justify-start items-center hover:scale-105 duration-150">
                            {IconWhatsapp}
                            Ponta Grossa - PR |
                            42 99909-4741
                        </a>

                        <p className="p-1 hover:text-red-800 flex flex-wrap gap-2 items-center justify-start hover:scale-105 duration-150">
                            {IconEmail}
                            <a href="mailto:contato@mgacorretora.com.br" className="flex text-sm md:text-base flex-wrap">
                                contato@mgacorretora.com.br
                            </a>
                        </p>
                    </div>
                    <p className='text-xl text-red-900 font-medium mt-2 subpixel-antialiased self-center flex md:hidden'>CRECI J5087</p>
                </div>
            </div>
        </footer>
    )
}
