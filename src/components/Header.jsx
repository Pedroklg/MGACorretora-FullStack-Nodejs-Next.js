import Link from 'next/link';
import Image from 'next/image';
import { IconEmail, IconHouse, IconShop, IconSearchSmall, IconBars, IconClose } from './Icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOtherMenusetIsOtherMenu, setIsOtherMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOtherMenu(window.innerWidth < 1270);
    const handleResize = () => {
      setIsOtherMenu(window.innerWidth < 1270);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSend = () => {
    if (searchTerm.toLowerCase() === 'empresas') {
      router.push(`/Empresas`);
    } else if (searchTerm.toLowerCase() === 'imoveis') {
      router.push(`/Imoveis`);
    } else {
      router.push(`/Search?q=${searchTerm}`);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="flex flex-col lg:flex-row justify-evenly items-center px-1 lg:px-10 bg-red-900 text-black shadow-lg">
      <Link href="/" passHref>
        <div className="p-2 flex flex-col justify-center items-center hover:scale-105 duration-150 bg-slate-100 cursor-pointer">
          <div className='hidden sm:block'>
            <Image src="/logo.png" alt="MGA Corretora" width={150} height={150} quality={100} priority />
          </div>
          <div className='block sm:hidden'>
            <Image src="/logo_mobile.png" alt='MGA Corretora' width={300} height={200} quality={100} priority />
          </div>
          <span className="text-lg text-red-900 font-medium mt-2 subpixel-antialiased hidden lg:flex">CRECI J5087</span>
        </div>
      </Link>

      <nav className="flex space-x-3 md:space-x-6 mt-4 md:mt-0 mb-4 sm:mb-0">
        <Link href="/Empresas" passHref>
          <div className="flex hover:text-gray-400 text-gray-100 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer flex-col md:flex-row hover:scale-105">
            {IconShop}
            <span className="ml-2">Empresas</span>
          </div>
        </Link>
        <Link href="/Imoveis" passHref>
          <div className="flex hover:text-gray-400 text-gray-100 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer flex-col md:flex-row hover:scale-105">
            {IconHouse}
            <span className="ml-2">Imóveis</span>
          </div>
        </Link>
        <Link href="/Contato" passHref>
          <div className="flex hover:text-gray-400 text-gray-100 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer flex-col md:flex-row hover:scale-105">
            {IconEmail}
            <span className="ml-2">Contato</span>
          </div>
        </Link>
        {!isOtherMenusetIsOtherMenu && (
          <>
            <Link href="/Sobre" passHref>
              <div className="flex hover:text-gray-400 text-gray-100 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer hover:scale-105">
                <span className="ml-2">Sobre nós</span>
              </div>
            </Link>
            <Link href="/QueroVender" passHref>
              <div className="flex hover:text-gray-400 text-gray-100 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer hover:scale-105">
                <span className="ml-2">Quero Vender</span>
              </div>
            </Link>
            <Link href="/SejaParceiro" passHref>
              <div className="flex hover:text-gray-400 text-gray-100 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer hover:scale-105">
                <span className="ml-2">Seja Parceiro</span>
              </div>
            </Link>
          </>
        )}
      </nav>

      <div className="flex items-center justify-center ml-3 mb-4 md:mb-0">
        <input
          type="text"
          placeholder=" O que você procura?  "
          className="p-1 rounded-sm shadow-md"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyUp={(e) => e.key === 'Enter' && handleSearchSend()}
        />
        <button
          className="flex bg-gray-200 text-red-800 p-1 ml-2 rounded-sm shadow-lg duration-150 hover:scale-105"
          onClick={handleSearchSend}
        >
          {IconSearchSmall}
        </button>
        {isOtherMenusetIsOtherMenu && (
          <div className="flex items-center justify-center ml-8">
            <button onClick={toggleMenu} className="text-gray-100 text-3xl">
              {menuOpen ? IconClose : IconBars}
            </button>
          </div>
        )}
      </div>

      {
        isOtherMenusetIsOtherMenu && menuOpen && (
          <aside className="w-full bg-red-900 text-gray-100 flex flex-col items-center shadow-lg">
            <Link href="/Sobre" passHref>
              <div className="w-full p-4 text-center hover:text-gray-400 duration-150 cursor-pointer" onClick={toggleMenu}>
                Sobre nós
              </div>
            </Link>
            <Link href="/QueroVender" passHref>
              <div className="w-full p-4 text-center hover:text-gray-400 duration-150 cursor-pointer" onClick={toggleMenu}>
                Quero Vender
              </div>
            </Link>
            <Link href="/SejaParceiro" passHref>
              <div className="w-full p-4 text-center hover:text-gray-400 duration-150 cursor-pointer" onClick={toggleMenu}>
                Seja Parceiro
              </div>
            </Link>
          </aside>
        )
      }
    </header >
  );
};

export default Header;
