import Nav from './componentsDash/Nav';
import Tabela from './componentsDash/Tabela';
import { protectRoute } from '../api/utils/sessionProtection';
import Head from 'next/head';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <Head>
                <title>Dashboard - MGA Corretora</title>
                <meta name="description" content="Acesse o dashboard administrativo da MGA Corretora. Gerencie empresas e imóveis." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Nav />
            <Tabela
                tipoMostrado={"ambos"}
            />
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default AdminDashboardPage;
