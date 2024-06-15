import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NumericFormat } from 'react-number-format';
import { IconSeach } from './Icones';

export default function EncontrarEmpresa() {
  const router = useRouter();

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [currentCidades, setCurrentCidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [currentBairros, setCurrentBairros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [categoria, setCategoria] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchMode, setSearchMode] = useState('both');
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Set to true to open menu by default on larger devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array to run effect only once on mount

  // Fetch estados, cidades, and categorias
  useEffect(() => {
    const fetchEstadosAndCidades = async () => {
      try {
        const estadosResponse = await fetch(`api/estados?searchMode=${searchMode}`);
        if (!estadosResponse.ok) {
          throw new Error('Failed to fetch estados');
        }
        const estadosData = await estadosResponse.json();
        setEstados(estadosData);

        const cidadesResponse = await fetch(`api/cidades?searchMode=${searchMode}`);
        if (!cidadesResponse.ok) {
          throw new Error('Failed to fetch cidades');
        }
        const cidadesData = await cidadesResponse.json();
        setCidades(cidadesData);
        setCurrentCidades(cidadesData); // Initially set all cidades
      } catch (error) {
        console.error('Error fetching estados and cidades:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const categoriasResponse = await fetch('/api/categorias');
        if (!categoriasResponse.ok) {
          throw new Error('Failed to fetch categorias');
        }
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    const fetchBairros = async () => {
      try {
        const response = await fetch(`api/bairros?searchMode=${searchMode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bairros');
        }
        const data = await response.json();
        setBairros(data);
        setCurrentBairros(data); // Initially set all bairros
      } catch (error) {
        console.error('Error fetching bairros:', error);
      }
    };

    fetchEstadosAndCidades();
    (searchMode === 'both' || searchMode === 'empresas') && fetchCategorias();
    fetchBairros();
  }, [searchMode]);

  // Update currentCidades based on selected estado
  useEffect(() => {
    if (estado) {
      const filteredCidades = cidades.filter(cidadeObject => cidadeObject.estado === estado);
      setCurrentCidades(filteredCidades);
      setCurrentBairros([]); // Reset bairros when estado changes
    } else {
      setCurrentCidades(cidades); // Show all cidades if no estado is selected
      setCurrentBairros(bairros); // Show all bairros if no estado is selected
    }
  }, [estado, cidades, bairros]);

  // Update currentBairros based on selected cidade
  useEffect(() => {
    if (cidade) {
      const filteredBairros = bairros.filter(bairroObject => bairroObject.cidade === cidade);
      setCurrentBairros(filteredBairros);
    } else {
      setCurrentBairros(bairros); // Show all bairros if no cidade is selected
    }
  }, [cidade, bairros]);

  const handleEstadoChange = e => {
    const selectedEstado = e.target.value;
    setEstado(selectedEstado);
    setCidade(''); // Reset cidade and bairro when estado changes
    setBairro('');
  };

  const handleCidadeChange = e => {
    const selectedCidade = e.target.value;
    setCidade(selectedCidade);
    setBairro(''); // Reset bairro when cidade changes
  };

  const handleBairroChange = e => {
    const selectedBairro = e.target.value;
    setBairro(selectedBairro);
  };

  const handleCategoriaChange = e => {
    const selectedCategoria = e.target.value;
    setCategoria(selectedCategoria);
  };

  const handleMinPriceChange = values => {
    setMinPrice(values.floatValue);
  };

  const handleMaxPriceChange = values => {
    setMaxPrice(values.floatValue);
  };

  const handleSearch = () => {
    if (!estado && !cidade && !bairro && !categoria && !minPrice && !maxPrice) {
      return;
    }
    const queryParams = {
      estado,
      cidade,
      bairro,
      categoria,
      minPrice,
      maxPrice,
      searchMode,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    console.log(queryString); // Outputs something like "estado=Acre&cidade=Rio%20de%20Janeiro&bairro=Botafogo&categoria=Comércio&minPrice=1000&maxPrice=5000&searchMode=both"

    router.push(`/Search?${queryString}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center w-full mt-2 md:mt-3 mb-4">
        <div className="flex justify-between items-center w-full mb-2 md:mb-0">
          <div className="flex items-center">
            {isMobile ? (
              <button
                onClick={toggleMenu}
                className={`px-4 py-2 cursor-pointer ${isMenuOpen ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
                  }  hover:bg-red-900 duration-150 hover:scale-105`}
              >
                {searchMode === 'both' ? 'Tudo' : searchMode === 'empresas' ? 'Empresas' : 'Imóveis'}
              </button>
            ) : (
              <>
                <div
                  onClick={() => setSearchMode('both')}
                  className={`px-4 py-2 cursor-pointer ${searchMode === 'both' ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
                    }  hover:bg-red-900 duration-150 hover:scale-105`}
                >
                  Tudo
                </div>
                <div
                  onClick={() => setSearchMode('empresas')}
                  className={`px-4 py-2 cursor-pointer ${searchMode === 'empresas' ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
                    }  hover:bg-red-900 duration-150 hover:scale-105`}
                >
                  Empresas
                </div>
                <div
                  onClick={() => setSearchMode('imoveis')}
                  className={`px-4 py-2 cursor-pointer ${searchMode === 'imoveis' ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
                    }  hover:bg-red-900 duration-150 hover:scale-105`}
                >
                  Imóveis
                </div>
              </>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={toggleMenu}
              className="p-2 focus:outline-none md:hidden"
            >
              {IconSeach}
            </button>
          )}
        </div>
        {(isMobile && isMenuOpen) || !isMobile ? (
          <div className="bg-gray-100 shadow-md rounded-md p-5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <div>
                <label htmlFor="estado" className="block text-xs font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={estado}
                  onChange={handleEstadoChange}
                  className="form-select w-full rounded-md shadow-md"
                >
                  <option key="default" value="">
                    Selecione um estado
                  </option>
                  {estados.map((estadoObject, index) => (
                    <option key={index} value={estadoObject.estado}>
                      {estadoObject.estado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cidade" className="block text-xs font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <select
                  id="cidade"
                  name="cidade"
                  value={cidade}
                  onChange={handleCidadeChange}
                  className="form-select w-full rounded-md shadow-md"
                >
                  <option key="default" value="">
                    Selecione uma cidade
                  </option>
                  {(estado || estado === '') && (
                    <>
                      {currentCidades.map((cidadeObject, index) => (
                        <option key={index} value={cidadeObject.cidade}>
                          {cidadeObject.cidade}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="bairro" className="block text-xs font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <select
                  id="bairro"
                  name="bairro"
                  value={bairro}
                  onChange={handleBairroChange}
                  className="form-select w-full rounded-md shadow-md"
                >
                  <option key="default" value="">
                    Selecione um bairro
                  </option>
                  {(cidade || cidade === '') && (
                    <>
                      {currentBairros.map((bairroObject, index) => (
                        <option key={index} value={bairroObject.bairro}>
                          {bairroObject.bairro}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="categoria" className="block text-xs font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={categoria}
                  onChange={handleCategoriaChange}
                  className="form-select w-full rounded-md shadow-md"
                >
                  <option key="default" value="">
                    Selecione uma categoria
                  </option>
                  {categorias.map((categoriaObject, index) => (
                    <option key={index} value={categoriaObject.categoria}>
                      {categoriaObject.categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="minPrice" className="block text-xs font-medium text-gray-700 mb-1">
                  Preço Mínimo
                </label>
                <NumericFormat
                  id="minPrice"
                  name="minPrice"
                  value={minPrice}
                  allowNegative={false}
                  decimalScale={2}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  className="form-input w-full rounded-md shadow-md"
                  onValueChange={handleMinPriceChange}
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-xs font-medium text-gray-700 mb-1">
                  Preço Máximo
                </label>
                <NumericFormat
                  id="maxPrice"
                  name="maxPrice"
                  value={maxPrice}
                  allowNegative={false}
                  decimalScale={2}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  className="form-input w-full rounded-md shadow-md"
                  onValueChange={handleMaxPriceChange}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-4 bg-red-800 hover:bg-red-900 text-white py-2 rounded-md shadow-md duration-150"
            >
              Buscar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}