import Link from 'next/link';
import Image from 'next/image';
import { IconEmail, IconHouse, IconShop, IconSearchSmall, IconBars, IconClose } from './Icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to store search term
  const [isMobile, setIsMobile] = useState(false); // State to manage mobile view
  const [menuOpen, setMenuOpen] = useState(false); // State to manage mobile menu
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768); // Set initial isMobile state based on window width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Update isMobile state on window resize
    };

    window.addEventListener('resize', handleResize); // Add event listener for window resize
    return () => window.removeEventListener('resize', handleResize); // Clean up event listener on unmount
  }, []);

  // Function to handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle search button click
  const handleSearchSend = () => {
    // Redirect to the search page with the search term as a query parameter
    if (searchTerm.toLowerCase() === 'empresas') {
      router.push(`/Empresas`);
    } else if (searchTerm.toLowerCase() === 'imoveis') {
      router.push(`/Imoveis`);
    } else {
      router.push(`/Search?q=${searchTerm}`);
    }
  };

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="flex flex-col md:flex-row justify-evenly items-center px-1 md:px-10 bg-red-900 text-black shadow-lg">
      <Link href="/" passHref>
        <div className="p-2 flex flex-col justify-center items-center hover:scale-105 duration-150 bg-slate-100 cursor-pointer">
          <div className='hidden sm:block'>
            <Image src="/logo.png" alt="MGA Corretora" width={150} height={150} />
          </div>
          <div className='block sm:hidden'>
            <Image src="/logo_mobile.png" alt='MGA Corretora' width={300} height={200} />
          </div>
          <span className="text-lg text-red-900 font-medium mt-2 subpixel-antialiased hidden md:flex">CRECI J5087</span>
        </div>
      </Link>

      {/* Navigation links */}
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
        {!isMobile && (
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

      {/* Mobile menu */}
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
        {/* Mobile menu toggle button */}
        {isMobile && (
          <div className="flex items-center justify-center ml-8">
            <button onClick={toggleMenu} className="text-gray-100 text-3xl">
              {menuOpen ? IconClose : IconBars}
            </button>
          </div>
        )}
      </div>

      {
        isMobile && menuOpen && (
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
