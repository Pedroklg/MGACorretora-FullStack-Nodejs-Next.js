import Link from 'next/link'
import Image from 'next/image'
import { IconEmail, IconWhatsapp } from './Icons'

export default function Footer() {
    return (
        <footer className="h-fit pb-5" style={{ backgroundImage: "url(/footer-bg.png)" }}>
            <div className='flex justify-center text-xl font-bold gap-24'>
                <Link href="/" passHref legacyBehavior>
                    <div className="hidden md:flex hover:scale-105 duration-150">
                        <Image src="/logo.png" alt="MGA Corretora" width={200} height={200} />
                    </div>
                </Link>
                <div className="flex ml-4 flex-col md:flex-row">
                    <div className="md:mx-16 md:flex-col">
                        <h4 className="p-2 text-2xl text-red-800">ONDE ESTAMOS?</h4>
                        <p className="p-1 hover:text-red-800 flex flex-wrap gap-2 justify-start items-center hover:scale-105 duration-150">
                            {IconWhatsapp}
                            Curitiba - PR |
                            <a href="tel:+5541995400788">41 99540-0788</a>

                        </p>
                        <p className="p-1 hover:text-red-800 flex flex-wrap gap-2 justify-start items-center hover:scale-105 duration-150">
                            {IconWhatsapp}
                            Ponta Grossa - PR |
                            <a href="tel:+5542999094741">42 99909-4741</a>

                        </p>
                        <p className="p-1 hover:text-red-800 flex flex-wrap gap-2 items-center justify-start hover:scale-105 duration-150">
                            {IconEmail}
                            <a href="mailto:contato@mgacorretora.com.br" className="flex text-sm md:text-base flex-wrap">
                                contato@mgacorretora.com.br
                            </a>
                        </p>
                    </div>
                    <div className="md:mx-8">
                        <h4 className="p-2 text-2xl text-red-800">A MGA</h4>
                        <ul>
                            <li className="p-1 hover:text-red-800 hover:scale-105 duration-150">
                                <Link href="/Sobre" passHref>
                                    <span>Sobre</span>
                                </Link>
                            </li>
                            <li className="p-1 hover:text-red-800 hover:scale-105 duration-150">
                                <Link href="/Contato" passHref>
                                    <span>Fale Conosco</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <p className='text-xl text-red-900 font-medium mt-2 subpixel-antialiased self-center flex md:hidden'>CRECI J5087</p>
                </div>
            </div>
        </footer>
    )
}
