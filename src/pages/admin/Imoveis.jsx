import Nav from '@/components/admin/Nav';
import Tabela from '@/components/admin/Tabela';
import { protectRoute } from '@/lib/session';
import Head from 'next/head';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col lg:flex-row overflow-auto">
            <Head>
                <title>Administrar Imóveis - MGA</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content="Gerencie os imóveis cadastrados na MGA Corretora. Visualize, edite ou adicione novos imóveis ao nosso banco de dados." />
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
