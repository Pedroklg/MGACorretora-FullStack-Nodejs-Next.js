import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconSeach } from './Icones';

export default function EncontrarEmpresa() {
    const router = useRouter();

    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [categoria, setCategoria] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        // Fetch estados from the database
        const fetchEstados = async () => {
            try {
                const response = await fetch('/api/estados');
                if (!response.ok) {
                    throw new Error('Failed to fetch estados');
                }
                const data = await response.json();
                setEstados(data);
            } catch (error) {
                console.error('Error fetching estados:', error);
            }
        };

        // Fetch cidades from the database
        const fetchCidades = async () => {
            try {
                const response = await fetch('/api/cidades');
                if (!response.ok) {
                    throw new Error('Failed to fetch cidades');
                }
                const data = await response.json();
                setCidades(data);
            } catch (error) {
                console.error('Error fetching cidades:', error);
            }
        };

        // Fetch categorias from the database
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

        fetchEstados();
        fetchCidades();
        fetchCategorias();
    }, []);

    const handleEstadoChange = (e) => {
        setEstado(e.target.value);
    };

    const handleCidadeChange = (e) => {
        setCidade(e.target.value);
    };

    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);
    };

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value);
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value);
    };

    const handleSearch = () => {
        const query = {
            estado,
            cidade,
            categoria,
            minPrice,
            maxPrice,
        };

        router.push({
            pathname: '/Search',
            query,
        });
    };

    return (
    <div className="flex justify-center">
      <div className="sm:relative lg:absolute z-10 flex items-center justify-center w-full max-w-5xl">
        <div className="bg-gray-100 opacity-90 shadow-md rounded-md p-5 w-full">
          <div className="flex items-center mb-4">
            {IconSeach}
            <h1 className="text-3xl text-red-900 ml-3">Encontre sua Empresa</h1>
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
                {estados.map((estado, index) => (
                  <option key={index} value={estado.estado}>{estado.estado}</option>
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
                {cidades.map((cidade, index) => (
                  <option key={index} value={cidade.cidade}>{cidade.cidade}</option>
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
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nome}>{categoria.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo (R$)</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                min="0"
                max="10000"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="form-input w-full"
                placeholder="Mínimo"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Máximo (R$)</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0"
                max="10000"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="form-input w-full"
                placeholder="Máximo"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Buscar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
