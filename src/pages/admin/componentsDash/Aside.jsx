import Image from "next/image";
import { IconEdit, IconHouse, IconShop } from "../../../components/Icones";
import Link from "next/link";

const Aside = ({ handleTipoMostradoChange, handleRegistrarClick }) => { // Receive handleRegistrarClick as a prop
  return (
    <aside className="box-border bg-gray-200 w-72 shadow-xl flex flex-col h-svh items-center pt-12">
      <div className="hover:cursor-pointer" onClick={() => handleTipoMostradoChange('ambos')}>
        <Image src="/logo.png" alt="MGA Corretora" width={200} height={200} priority style={{ width: "auto" }} />
      </div>
      <div className="border-t-4 border-red-800 w-full mt-14 rounded-3xl"></div>
      <div className="flex flex-col text-4xl m-8 font-bold text-red-800 decoration">
        <div className="p-5 hover:cursor-pointer" onClick={() => handleTipoMostradoChange('Empresas')}>
          <div className="flex items-center justify-center p-1 gap-3">{IconShop}Empresas</div>
        </div>
        <div className="p-5 hover:cursor-pointer" onClick={() => handleTipoMostradoChange('Imoveis')}>
          <div className="flex items-center justify-center p-1 gap-3">{IconHouse}Imóveis</div>
        </div>
        <div className="p-5 hover:cursor-pointer" onClick={handleRegistrarClick}>
            <div className="flex items-center justify-center p-1 gap-3">{IconEdit}Registrar</div>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
