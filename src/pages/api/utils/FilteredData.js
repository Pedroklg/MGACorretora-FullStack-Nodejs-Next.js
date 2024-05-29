const FilteredData = (dataToShow, searchTerm) => {
  if (!searchTerm) return dataToShow;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const filteredData = dataToShow.filter(item => {
      return (
          item.id?.toString().includes(lowerSearchTerm) ||
          item.titulo?.toLowerCase().includes(lowerSearchTerm) ||
          item.sobre_o_imovel?.toLowerCase().includes(lowerSearchTerm) ||
          (item.valor_pretendido && item.valor_pretendido.toString().toLowerCase().includes(lowerSearchTerm)) ||
          (item.area_construida && item.area_construida.toString().toLowerCase().includes(lowerSearchTerm)) ||
          (item.area_util && item.area_util.toString().toLowerCase().includes(lowerSearchTerm)) ||
          (item.aceita_permuta !== null && item.aceita_permuta.toString().toLowerCase().includes(lowerSearchTerm)) ||
          (item.tem_divida !== null && item.tem_divida.toString().toLowerCase().includes(lowerSearchTerm)) ||
          item.motivo_da_venda?.toLowerCase().includes(lowerSearchTerm) ||
          item.condicoes?.toLowerCase().includes(lowerSearchTerm) ||
          item.estado?.toLowerCase().includes(lowerSearchTerm) ||
          item.cidade?.toLowerCase().includes(lowerSearchTerm) ||
          (item.endereco && item.endereco.toLowerCase().includes(lowerSearchTerm))
      );
  });

  return filteredData;
};

export default FilteredData;