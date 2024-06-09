import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import { useState, useEffect } from "react";

// FilteredData function to filter data based on category
const FilteredData = (dataToShow, categoria) => {
  if (!categoria) return dataToShow;

  return dataToShow.filter(item => item.categoria === categoria);
};

function Empresas() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [dataToShow, setDataToShow] = useState([]);

  useEffect(() => {
    fetchCategorias();
    fetchEmpresas();
  }, []);

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

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('/api/empresas');
      if (!response.ok) {
        throw new Error('Failed to fetch empresas');
      }
      const data = await response.json();
      setDataToShow(data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    }
  };

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const filteredData = FilteredData(dataToShow, categoriaSelecionada);

  return (
    <div className="flex flex-col min-h-screen">
      <title>Empresas</title>
      <Header />
      <div className="flex flex-col sm:flex-row justify-center">
        <aside className="w-fit p-4 sm:m-12 sm:mt-16 mt-8 shadow-lg rounded-xl items-start flex flex-row flex-wrap sm:flex-col h-full">
          <h2 className="text-3xl font-bold sm:mb-8 text-red-800 w-full">Categorias</h2>
          {categorias.map((categoria) => (
            <div key={categoria.id} className="mb-2">
              <button
                onClick={() => handleCategoriaClick(categoria.categoria)}
                className={`p-2 m-1 rounded-md shadow-md ${categoriaSelecionada === categoria.categoria ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
              >
                {categoria.categoria}
              </button>
            </div>
          ))}
        </aside>
        <div className="flex flex-grow">
          <div className="sm:w-11/12 w-full p-4">
            <Cards tipoMostrado="Empresas" dataToShow={filteredData} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Empresas;
export { FilteredData };
