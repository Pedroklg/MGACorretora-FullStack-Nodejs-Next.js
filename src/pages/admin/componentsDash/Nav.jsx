import Image from "next/image";
import { IconEdit, IconHouse, IconShop } from "../../../components/Icones";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="box-border bg-red-900 w-full lg:w-72 shadow-xl flex flex-col items-center pt-2 lg:pt-12">
      <Link href="/admin/Dashboard">
        <div className="hover:cursor-pointer bg-gray-100 p-2 rounded-lg">
          <div className='hidden sm:block'>
            <Image src="/logo.png" alt="MGA Corretora" width={200} height={200} />
          </div>
          <div className='block sm:hidden'>
            <Image src="/logo_mobile.png" alt='MGA Corretora' width={300} height={250} />
          </div>
        </div>
      </Link>
      <div className="border-t-4 border-gray-100 w-full mt-2 lg:mt-14 rounded-3xl"></div>
      <div className="flex flex-row lg:flex-col text-base lg:text-4xl  m-1 lg:m-8 font-bold text-gray-200 decoration">
        <Link href="/admin/Empresas">
          <div className="p-1 lg:p-5 hover:cursor-pointer">
            <div className="flex items-center justify-center p-1 gap-3 hover:text-gray-400 text-gray-100">{IconShop}Empresas</div>
          </div>
        </Link>
        <Link href="/admin/Imoveis">
          <div className="p-1 lg:p-5 hover:cursor-pointer">
            <div className="flex items-center justify-center p-1 gap-3 hover:text-gray-400 text-gray-100">{IconHouse}Imóveis</div>
          </div>
        </Link>
        <Link href="/admin/Registrar">
          <div className="p-1 lg:p-5 hover:cursor-pointer">
            <div className="flex items-center justify-center p-1 gap-3 hover:text-gray-400 text-gray-100">{IconEdit}Registrar</div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
