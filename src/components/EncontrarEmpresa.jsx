import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NumericFormat } from 'react-number-format';  // Correct the import statement
import { IconSeach } from './Icones';

export default function EncontrarEmpresa() {
  const router = useRouter();

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [currentCidades, setCurrentCidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchEstadosAndCidades = async () => {
      try {
        const estadosResponse = await fetch('/api/estados');
        if (!estadosResponse.ok) {
          throw new Error('Failed to fetch estados');
        }
        const estadosData = await estadosResponse.json();
        setEstados(estadosData);

        const cidadesResponse = await fetch('/api/cidades');
        if (!cidadesResponse.ok) {
          throw new Error('Failed to fetch cidades');
        }
        const cidadesData = await cidadesResponse.json();
        setCidades(cidadesData);
      } catch (error) {
        console.error('Error fetching estados and cidades:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
          throw new Error('Failed to fetch categorias');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchEstadosAndCidades();
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (estado) {
      const filteredCidades = cidades.filter((cidadeObject) => cidadeObject.estado === estado);
      setCurrentCidades(filteredCidades);
    } else {
      setCurrentCidades(cidades);
    }
  }, [estado, cidades]);

  const handleEstadoChange = (e) => {
    const selectedEstado = e.target.value;
    setEstado(selectedEstado);
  };

  const handleCidadeChange = (e) => {
    setCidade(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleMinPriceChange = (values) => {
    setMinPrice(values.floatValue);
  };

  const handleMaxPriceChange = (values) => {
    setMaxPrice(values.floatValue);
  };

  const handleSearch = () => {
    if (!estado && !cidade && !categoria && !minPrice && !maxPrice) {
      return;
    }
    const queryParams = {
      estado,
      cidade,
      categoria,
      minPrice,
      maxPrice,
    };

    const queryString = new URLSearchParams(queryParams).toString();

    router.push(`/Search?${queryString}`);
  };

  return (
    <div className="flex justify-center">
      <div className="sm:relative lg:absolute z-10 flex items-center justify-center w-full md:max-w-3xl xl:max-w-5xl md:mt-2">
        <div className="bg-gray-100 bg-opacity-70 shadow-md rounded-md p-5 w-full" 
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}>
          <div className="flex items-center mb-4">
            {IconSeach}
            <h1 className="text-3xl text-red-900 ml-3">Encontre sua Empresa ou Imóvel</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="estado" className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
              <select
                id="estado"
                name="estado"
                value={estado}
                onChange={handleEstadoChange}
                className="form-select w-full"
              >
                <option key="default" value="">Selecione um estado</option>
                {estados.map((estadoObject, index) => (
                  <option key={index} value={estadoObject.estado}>{estadoObject.estado}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cidade" className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
              <select
                id="cidade"
                name="cidade"
                value={cidade}
                onChange={handleCidadeChange}
                className="form-select w-full"
              >
                <option key="default" value="">Selecione uma cidade</option>
                {currentCidades.map((cidadeObject, index) => (
                  <option key={index} value={cidadeObject.cidade}>{cidadeObject.cidade}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={handleCategoriaChange}
                className="form-select w-full"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoriaObject, index) => (
                  <option key={index} value={categoriaObject.categoria}>{categoriaObject.categoria}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo (R$)</label>
              <NumericFormat
                id="minPrice"
                name="minPrice"
                value={minPrice}
                onValueChange={handleMinPriceChange}
                thousandSeparator='.'
                decimalSeparator=","
                prefix="R$ "
                className="form-input w-full"
                placeholder="Mínimo"
                isnumericstring="true"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Máximo (R$)</label>
              <NumericFormat
                id="maxPrice"
                name="maxPrice"
                value={maxPrice}
                onValueChange={handleMaxPriceChange}
                thousandSeparator='.'
                decimalSeparator=","
                prefix="R$ "
                className="form-input w-full"
                placeholder="Máximo"
                isnumericstring="true"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-150 hover:scale-105">Buscar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
