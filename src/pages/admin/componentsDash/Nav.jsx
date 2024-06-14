import Image from "next/image";
import { IconEdit, IconHouse, IconShop } from "../../../components/Icones";

const Nav = ({ handleTipoMostradoChange, handleRegistrarClick }) => { // Receive handleRegistrarClick as a prop
  return (
    <nav className="box-border bg-red-900 w-full lg:w-72 shadow-xl flex flex-col h-fit lg:h-svh items-center pt-2 lg:pt-12">
      <div className="hover:cursor-pointer bg-gray-100 p-2 rounded-lg" onClick={() => handleTipoMostradoChange('ambos')}>
        <div className='hidden sm:block'>
          <Image src="/logo.png" alt="MGA Corretora" width={200} height={200}/>
        </div>
        <div className='block sm:hidden'>
          <Image src="/logo_mobile.png" alt='MGA Corretora' width={300} height={250} />
        </div>
      </div>
      <div className="border-t-4 border-gray-100 w-full mt-2 lg:mt-14 rounded-3xl"></div>
      <div className="flex felx-row lg:flex-col text-base lg:text-4xl  m-1 lg:m-8 font-bold text-gray-200 decoration">
        <div className="p-1 lg:p-5 hover:cursor-pointer" onClick={() => handleTipoMostradoChange('Empresas')}>
          <div className="flex items-center justify-center p-1 gap-3 hover:text-gray-400 text-gray-100">{IconShop}Empresas</div>
        </div>
        <div className="p-1 lg:p-5 hover:cursor-pointer" onClick={() => handleTipoMostradoChange('Imoveis')}>
          <div className="flex items-center justify-center p-1 gap-3 hover:text-gray-400 text-gray-100">{IconHouse}Imóveis</div>
        </div>
        <div className="p-1 lg:p-5 hover:cursor-pointer" onClick={handleRegistrarClick}>
          <div className="flex items-center justify-center p-1 gap-3 hover:text-gray-400 text-gray-100">{IconEdit}Registrar</div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
