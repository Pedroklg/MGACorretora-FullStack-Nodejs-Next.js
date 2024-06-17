import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NumericFormat } from 'react-number-format';
import { IconBars, IconClose, IconSearch } from './Icons';

export default function EncontrarEmpresa() {
  const router = useRouter();

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [currentCidades, setCurrentCidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [currentBairros, setCurrentBairros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [finalidade, setFinalidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [categoria, setCategoria] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchMode, setSearchMode] = useState('both');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch estados, cidades, and categorias
  useEffect(() => {
    const fetchEstadosAndCidades = async () => {
      try {
        const estadosResponse = await fetch(`/api/estados?searchMode=${searchMode}`);
        if (!estadosResponse.ok) {
          throw new Error('Failed to fetch estados');
        }
        const estadosData = await estadosResponse.json();
        setEstados(estadosData);

        const cidadesResponse = await fetch(`/api/cidades?searchMode=${searchMode}`);
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
        const response = await fetch(`/api/bairros?searchMode=${searchMode}`);
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
    setFinalidade(''); // Reset finalidade when categoria changes
  };

  const handlefinalidadeChange = e => {
    const selectedfinalidade = e.target.value;
    setFinalidade(selectedfinalidade);
    setCategoria(''); // Reset categoria when finalidade changes
  };

  const handleMinPriceChange = values => {
    setMinPrice(values.floatValue);
  };

  const handleMaxPriceChange = values => {
    setMaxPrice(values.floatValue);
  };

  const handleSearchModeChange = values => {
    setBairro('');
    setCidade('');
    setEstado('');
    setCategoria('');
    setFinalidade('');
    setSearchMode(values);
  };

  const handleSearch = () => {
    if (!estado && !cidade && !bairro && !categoria && !finalidade && !minPrice && !maxPrice) {
      return;
    }
    const queryParams = {
      estado,
      cidade,
      bairro,
      categoria,
      finalidade,
      minPrice,
      maxPrice,
      searchMode,
    };

    const queryString = new URLSearchParams(queryParams).toString();

    router.push(`/Search?${queryString}`);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full lg:mt-4 mt-2 mb-2">
        <div className={`flex justify-start self-start ${isMobile && !menuOpen ? 'hidden' : ''}`}>
          <button
            onClick={() => handleSearchModeChange('both')}
            className={`px-4 py-2 ${searchMode === 'both' ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
              }  hover:bg-red-900 hover:text-gray-100 duration-150 hover:scale-105`}
          >
            Tudo
          </button>
          <button
            onClick={() => handleSearchModeChange('empresas')}
            className={`px-4 py-2 ${searchMode === 'empresas' ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
              }  hover:bg-red-900 hover:text-gray-100 duration-150 hover:scale-105`}
          >
            Empresas
          </button>
          <button
            onClick={() => handleSearchModeChange('imoveis')}
            className={`px-4 py-2 ${searchMode === 'imoveis' ? 'bg-red-800 text-white' : 'bg-gray-200 text-red-800'
              }  hover:bg-red-900 hover:text-gray-100 duration-150 hover:scale-105`}
          >
            Imóveis
          </button>
        </div>
        <div className="bg-gray-100 shadow-md rounded-sm px-4 py-1 w-full">
          {isMobile && (
            <button
              onClick={toggleMenu}
              className="w-full m-2"
            >
              <div className="flex items-center">
                {IconSearch}
                <h1 className="text-2xl md:text-xl lg:text-3xl text-red-900 ml-3">
                  Encontre {searchMode === 'both' ? "sua Empresa ou Imóvel" : searchMode === 'empresas' ? "sua Empresa" : "seu Imóvel"}
                </h1>
                {menuOpen ? IconClose : IconBars}
              </div>
            </button>
          )}

          {(!isMobile) &&
            <div className="flex items-center mb-1">
              {IconSearch}
              <h1 className="text-3xl text-red-900 ml-3">
                Encontre {searchMode === 'both' ? "sua Empresa ou Imóvel" : searchMode === 'empresas' ? "sua Empresa" : "seu Imóvel"}
              </h1>
            </div>}
          <div className={`${isMobile && !menuOpen ? 'hidden' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-baseline">
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
                        bairroObject.bairro !== "" && bairroObject.bairro !== " " && (
                          <option key={index} value={bairroObject.bairro}>
                            {bairroObject.bairro}
                          </option>
                        )
                      ))}
                    </>
                  )}
                </select>
              </div>
              {(searchMode === 'both' || searchMode === 'empresas') ? (
                <div>
                  <label
                    htmlFor="categoria"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Categoria
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={categoria}
                    onChange={handleCategoriaChange}
                    className="form-select w-full rounded-md shadow-md"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoriaObject, index) => (
                      <option key={index} value={categoriaObject.categoria}>
                        {categoriaObject.categoria}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (<div>
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Venda ou Locação:
                </label>
                <select
                  id="finalidade"
                  name="finalidade"
                  value={finalidade}
                  onChange={handlefinalidadeChange}
                  className="form-select w-full rounded-md shadow-md"
                >
                  <option value="">Venda e Locação</option>
                  <option value="venda">Venda</option>
                  <option value="locacao">Locação</option>
                </select>
              </div>
              )}
              <div>
                <label
                  htmlFor="minPrice"
                  className="block text-sm font-medium text-gray-700 mb-0.5"
                >
                  Valor Mínimo (R$):
                </label>
                <NumericFormat
                  id="minPrice"
                  name="minPrice"
                  value={minPrice}
                  onValueChange={handleMinPriceChange}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  className="form-input w-full rounded-md shadow-md"
                  placeholder="Mínimo"
                />
              </div>
              <div>
                <label
                  htmlFor="maxPrice"
                  className="block text-sm font-medium text-gray-700 mb-0.5"
                >
                  Valor Máximo (R$):
                </label>
                <NumericFormat
                  id="maxPrice"
                  name="maxPrice"
                  value={maxPrice}
                  onValueChange={handleMaxPriceChange}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  className="form-input w-full rounded-md shadow-md"
                  placeholder="Máximo"
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-150 hover:scale-105"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}