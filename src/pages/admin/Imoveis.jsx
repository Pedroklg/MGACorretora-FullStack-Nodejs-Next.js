import Nav from './componentsDash/Nav';
import Tabela from './componentsDash/Tabela';
import { protectRoute } from '../api/utils/sessionProtection';
import Head from 'next/head';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <Head>
                <title>Administrar Imóveis - MGA</title>
                <meta name="description" content="Gerencie os imóveis cadastrados na MGA Corretora. Visualize, edite ou adicione novos imóveis ao nosso banco de dados." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Nav />
            <Tabela
                tipoMostrado={"Imoveis"}
            />
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default AdminDashboardPage;
