import Link from 'next/link';
import Image from 'next/image';
import { IconEmail, IconHouse, IconSearchSmall, IconShop } from './Icones';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to store search term
  const router = useRouter();

  // Function to handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle search button click
  const handleSearchSend = () => {
    // Redirect to the search page with the search term as a query parameter
    if (searchTerm.toLowerCase() === 'empresas') {
      router.push(`/Empresas`);
      return;
    } else if (searchTerm.toLowerCase() === 'imoveis') {
      router.push(`/Imoveis`);
      return;
    }
    router.push(`/Search?q=${searchTerm}`);
  };

  return (
    <header className="flex flex-wrap md:flex-nowrap justify-evenly items-center px-1 md:px-10 bg-gray-200 text-black shadow-lg">
      <div className="p-1 flex flex-col justify-center items-center hover:scale-105 duration-150">
        <Link href="/" passHref legacyBehavior>
          <a>
            <Image src="/logo.png" alt="MGA Corretora" width={150} height={150} />
          </a>
        </Link>
        <span className="text-lg text-red-800 font-medium mt-2">CRECI J5087</span>
      </div>

      <nav className="flex space-x-3 md:space-x-6 mt-4 md:mt-0 mb-4 sm:mb-0">
        <Link href="/Empresas" passHref legacyBehavior>
          <div className="flex hover:text-red-800 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer flex-col md:flex-row hover:scale-105">
            {IconShop}
            <span className="ml-2">Empresas</span>
          </div>
        </Link>
        <Link href="/Imoveis" passHref legacyBehavior>
          <div className="flex hover:text-red-800 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer flex-col md:flex-row hover:scale-105">
            {IconHouse}
            <span className="ml-2">Imóveis</span>
          </div>
        </Link>
        <Link href="/Contato" passHref legacyBehavior>
          <div className="flex hover:text-red-800 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer flex-col md:flex-row hover:scale-105">
            {IconEmail}
            <span className="ml-2">Contato</span>
          </div>
        </Link>
        <div className="hidden lg:flex">
          <Link href="/Sobre" passHref legacyBehavior>
            <div className="flex hover:text-red-800 text-2xl items-center justify-center font-semibold duration-150 cursor-pointer hover:scale-105">
              <span className="ml-2">Sobre nós</span>
            </div>
          </Link>
        </div>
      </nav>
      <div className="flex items-center justify-center ml-3 mb-4 md:mb-0">
        <input
          type="text"
          placeholder=" O que você procura?  "
          className="p-1 rounded-sm shadow-md"
          value={searchTerm} // Set input value to the search term state
          onChange={handleSearchChange}
          onKeyUp={(e) => e.key === 'Enter' && handleSearchSend()} // Call handleSearchChange on input change
        />
        <button
          className="flex bg-red-800 text-gray-200 p-1 ml-2 rounded-sm shadow-lg duration-150 hover:scale-105"
          onClick={handleSearchSend} // Call handleSearchClick on button click
        >
          {IconSearchSmall}
        </button>
      </div>
    </header>
  );
};

export default Header;
