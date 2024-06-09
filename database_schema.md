# Database Schema

## Shared Sequence

### Name:

- `shared_id_sequence`: Sequence used for generating shared IDs between tables.

## Table: Empresas

### Columns:

- `id`: INTEGER - Primary key auto-generated unique identifier using the shared sequence.
- `aceita_permuta`: BOOLEAN - Indicates if the empresa accepts barter.
- `tem_divida`: BOOLEAN - Indicates if the empresa has debts.
- `funcionarios`: INTEGER - Number of employees working for the empresa.
- `tempo_de_mercado`: INTEGER - Time (in years) the empresa has been in the market.
- `valor_pretendido`: NUMERIC - The empresa's desired value.
- `imagem`: VARCHAR - Path to the empresa's image.
- `estado`: VARCHAR - Estado where the empresa is located.
- `cidade`: VARCHAR - City where the empresa is located.
- `categoria`: VARCHAR - Category of the empresa.
- `titulo`: VARCHAR - Title of the empresa.
- `motivo_da_venda`: TEXT - Reason for selling the empresa.
- `condicoes`: TEXT - Conditions of the empresa.
- `sobre_o_imovel`: TEXT - Description about the empresa.
- `endereco`: VARCHAR - Address of the empresa.

## Table: Imoveis

### Columns:

- `id`: INTEGER - Primary key auto-generated unique identifier using the shared sequence.
- `area_construida`: NUMERIC - Area constructed for the imóvel.
- `area_util`: NUMERIC - Useful area of the imóvel.
- `aceita_permuta`: BOOLEAN - Indicates if the imóvel accepts barter.
- `tem_divida`: BOOLEAN - Indicates if the imóvel has debts.
- `valor_pretendido`: NUMERIC - The imóvel's desired value.
- `aluguel`: BOOLEAN - Indicates if the imóvel is for rent.
- `motivo_da_venda`: TEXT - Reason for selling the imóvel.
- `endereco`: VARCHAR - Address of the imóvel.
- `titulo`: VARCHAR - Title of the imóvel.
- `imagem`: VARCHAR - Path to the imóvel's image.
- `condicoes`: TEXT - Conditions of the imóvel.
- `sobre_o_imovel`: TEXT - Description about the imóvel.
- `estado`: VARCHAR - Estado where the imóvel is located.
- `cidade`: VARCHAR - City where the imóvel is located.

## Table: Admins

### Columns:

- `id`: INTEGER - Primary key auto-generated unique identifier.
- `username`: VARCHAR - Username of the admin.
- `password`: VARCHAR - Password of the admin.
