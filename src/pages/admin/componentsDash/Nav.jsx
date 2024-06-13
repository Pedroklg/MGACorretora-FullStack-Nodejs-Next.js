import Image from "next/image";
import { IconEdit, IconHouse, IconShop } from "../../../components/Icones";

const Nav = ({ handleTipoMostradoChange, handleRegistrarClick }) => { // Receive handleRegistrarClick as a prop
  return (
    <nav className="box-border bg-red-900 w-full md:w-72 shadow-xl flex flex-col h-fit md:h-svh items-center pt-2 md:pt-12">
      <div className="hover:cursor-pointer bg-slate-200 p-2 rounded-md" onClick={() => handleTipoMostradoChange('ambos')}>
        <Image src="/logo.png" alt="MGA Corretora" width={180} height={180} priority style={{ width: "auto" }} />
      </div>
      <div className="border-t-4 border-gray-200 w-full mt-2 md:mt-14 rounded-3xl"></div>
      <div className="flex felx-row md:flex-col text-base md:text-4xl  m-1 md:m-8 font-bold text-gray-200 decoration">
        <div className="p-1 md:p-5 hover:cursor-pointer" onClick={() => handleTipoMostradoChange('Empresas')}>
          <div className="flex items-center justify-center p-1 gap-3">{IconShop}Empresas</div>
        </div>
        <div className="p-1 md:p-5 hover:cursor-pointer" onClick={() => handleTipoMostradoChange('Imoveis')}>
          <div className="flex items-center justify-center p-1 gap-3">{IconHouse}Imóveis</div>
        </div>
        <div className="p-1 md:p-5 hover:cursor-pointer" onClick={handleRegistrarClick}>
            <div className="flex items-center justify-center p-1 gap-3">{IconEdit}Registrar</div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
