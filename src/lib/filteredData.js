const FilteredData = (dataToShow, searchTerm) => {
  if (!searchTerm) return dataToShow;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const filteredData = dataToShow.filter(item => {
      return (
          item.id?.toString().includes(lowerSearchTerm) ||
          item.titulo?.toLowerCase().includes(lowerSearchTerm) ||
          item.descricao?.toLowerCase().includes(lowerSearchTerm) ||
          (item.valor_pretendido && item.valor_pretendido.toString().toLowerCase().includes(lowerSearchTerm)) ||
          (item.area_construida && item.area_construida.toString().toLowerCase().includes(lowerSearchTerm)) ||
          (item.area_util && item.area_util.toString().toLowerCase().includes(lowerSearchTerm)) ||
          item.motivo_da_venda?.toLowerCase().includes(lowerSearchTerm) ||
          item.condicoes?.toLowerCase().includes(lowerSearchTerm) ||
          item.estado?.toLowerCase().includes(lowerSearchTerm) ||
          item.cidade?.toLowerCase().includes(lowerSearchTerm) ||
          (item.bairro && item.bairro.toLowerCase().includes(lowerSearchTerm))
      );
  });

  return filteredData;
};

export default FilteredData;