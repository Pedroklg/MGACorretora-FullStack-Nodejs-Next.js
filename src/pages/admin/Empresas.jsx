import Nav from './componentsDash/Nav';
import Tabela from './componentsDash/Tabela';
import { protectRoute } from '../api/utils/sessionProtection';
import Head from 'next/head';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <Head>
                <title>Administrar Empresas - MGA</title>
                <meta name="description" content="Gerencie as empresas cadastradas na MGA Corretora. Visualize, edite ou adicione novas empresas ao nosso banco de dados." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Nav />
            <Tabela
                tipoMostrado={"Empresas"}
            />
        </div>
    );
};

export const getServerSideProps = protectRoute;

export default AdminDashboardPage;
